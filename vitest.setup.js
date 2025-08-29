import '@testing-library/jest-dom'
import { vi } from 'vitest'
import { cleanup } from '@testing-library/react'

Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true,
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})
