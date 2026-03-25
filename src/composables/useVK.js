/**
 * useVK — thin wrapper around VK Bridge SDK
 *
 * Replaces useTelegram.js for VK Mini Apps platform.
 * Uses @vkontakte/vk-bridge for communication with VK client.
 *
 * SINGLETON: VKWebAppInit and bridge.subscribe are called once.
 * Subsequent calls to useVK() return the cached state.
 *
 * See: https://dev.vk.com/ru/mini-apps/getting-started
 */
import bridge from '@vkontakte/vk-bridge'

// ── Singleton state ──────────────────────────────────────────
let _initialized = false
let _vkUserId = null
let _vkAppId = ''
let _vkPlatform = ''
let _detectedLang = 'en'
let _authHeader = {}
let _launchParams = ''
let _refUserId = null

function _initOnce() {
  if (_initialized) return
  _initialized = true

  // Initialize VK Bridge — MUST be called once before any other bridge method
  bridge.send('VKWebAppInit')

  // ── Parse launch params ────────────────────────────────────
  const urlParams = new URLSearchParams(window.location.search)
  _vkUserId = urlParams.get('vk_user_id')
    ? parseInt(urlParams.get('vk_user_id'), 10)
    : null
  _vkAppId = urlParams.get('vk_app_id') || ''
  _vkPlatform = urlParams.get('vk_platform') || ''

  _launchParams = window.location.search.slice(1)
  _authHeader = _launchParams
    ? { 'X-VK-Launch-Params': _launchParams }
    : {}

  // ── Language detection ─────────────────────────────────────
  const vkLang = urlParams.get('vk_language') || 'ru'
  _detectedLang = vkLang.startsWith('ru') ? 'ru'
    : vkLang.startsWith('zh') ? 'zh'
    : (vkLang === 'id' || vkLang === 'in') ? 'id'
    : 'en'

  // ── Referral ───────────────────────────────────────────────
  const hashRef = window.location.hash?.replace('#', '') || ''
  _refUserId = hashRef.startsWith('ref_') ? hashRef.slice(4) : null

  // ── Viewport & theme (subscribe once) ──────────────────────
  bridge.subscribe((e) => {
    if (e.detail?.type === 'VKWebAppUpdateConfig') {
      const data = e.detail.data
      if (data.scheme) {
        document.documentElement.setAttribute('data-vk-scheme', data.scheme)
      }
      // VKWebAppUpdateConfig provides insets (safe area) but not viewport_height.
      // Use window.innerHeight minus insets for usable area.
      if (data.insets) {
        const usableHeight = window.innerHeight - (data.insets.top || 0) - (data.insets.bottom || 0)
        document.documentElement.style.setProperty(
          '--vk-viewport-height',
          usableHeight + 'px'
        )
      }
    }
  })

  // Also set initial viewport height from window
  document.documentElement.style.setProperty(
    '--vk-viewport-height',
    window.innerHeight + 'px'
  )
  // Update on resize (handles orientation change, keyboard show/hide)
  window.addEventListener('resize', () => {
    document.documentElement.style.setProperty(
      '--vk-viewport-height',
      window.innerHeight + 'px'
    )
  })
}

// ── Shared functions (safe to create per-call) ───────────────

function haptic(style = 'light') {
  try {
    bridge.send('VKWebAppTapticImpactOccurred', {
      style: style === 'heavy' ? 'heavy' : style === 'medium' ? 'medium' : 'light'
    }).catch(() => {})
  } catch {}
}

let _backHandler = null
function setBackHandler(handler) {
  if (_backHandler) {
    window.removeEventListener('popstate', _backHandler)
  }
  if (handler) {
    _backHandler = (e) => {
      e.preventDefault()
      handler()
      window.history.pushState(null, '', window.location.href)
    }
    window.addEventListener('popstate', _backHandler)
    window.history.pushState(null, '', window.location.href)
  } else {
    _backHandler = null
  }
}

async function openPayForm(amount, description, payload) {
  try {
    const result = await bridge.send('VKWebAppOpenPayForm', {
      app_id: parseInt(_vkAppId, 10),
      action: 'pay-to-service',
      params: {
        amount: amount,
        description: description,
        action: 'pay-to-service',
        merchant_id: parseInt(_vkAppId, 10),
        version: 2,
        sign: '',
        data: JSON.stringify({ payload }),
      },
    })
    return result
  } catch (e) {
    console.warn('[Blink VK] Pay form error:', e)
    return { status: false, error: e }
  }
}

async function showOrderBox(item) {
  try {
    const result = await bridge.send('VKWebAppShowOrderBox', {
      type: 'item',
      item: String(item),
    })
    // VK Bridge returns: { success: true, order_id: "..." } on success
    // or throws on cancel/error
    return { status: true, order_id: result?.order_id || result?.orderId || '' }
  } catch (e) {
    // User cancelled or error
    if (e?.error_data?.error_code === 4) {
      // User cancelled — not an error
      return { status: false, cancelled: true }
    }
    console.warn('[Blink VK] Order box error:', e)
    return { status: false, error: e }
  }
}

function shareUrl(url, text) {
  bridge.send('VKWebAppShare', { link: url }).catch(() => {
    window.open(
      `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
      '_blank'
    )
  })
}

async function postToWall(message, attachments = '') {
  try {
    return await bridge.send('VKWebAppShowWallPostBox', { message, attachments })
  } catch (e) {
    console.warn('[Blink VK] Wall post error:', e)
    return null
  }
}

async function getUserInfo() {
  try {
    return await bridge.send('VKWebAppGetUserInfo')
  } catch {
    return null
  }
}

function closeApp() {
  bridge.send('VKWebAppClose', { status: 'success' }).catch(() => {})
}

// ── Exported composable ──────────────────────────────────────
export function useVK() {
  _initOnce()

  return {
    bridge,
    vkUserId: _vkUserId,
    userId: _vkUserId,
    vkAppId: _vkAppId,
    vkPlatform: _vkPlatform,
    detectedLang: _detectedLang,
    authHeader: _authHeader,
    launchParams: _launchParams,
    refUserId: _refUserId,
    haptic,
    setBackHandler,
    openPayForm,
    showOrderBox,
    shareUrl,
    postToWall,
    getUserInfo,
    closeApp,
  }
}
