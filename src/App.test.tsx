import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App.tsx'

describe('App', () => {
  it('rendert die Überschrift', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: 'Sleep Calculator' }),
    ).toBeDefined()
  })
})
