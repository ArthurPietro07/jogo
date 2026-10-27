let audioContext

export function playTone(type = 'tap', enabled = true) {
  if (!enabled) return
  try {
    audioContext ||= new AudioContext()
    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()
    const frequency = type === 'win' ? 660 : type === 'error' ? 180 : 360
    oscillator.frequency.value = frequency
    oscillator.type = 'sine'
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.045, audioContext.currentTime + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.12)
    oscillator.connect(gain).connect(audioContext.destination)
    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.13)
  } catch {
    // Audio is an optional enhancement and may be unavailable.
  }
}
