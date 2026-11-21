export type ValidationErrors = Record<string, string>

export function required(value: string, label: string): string | undefined {
  return value.trim().length > 0 ? undefined : `${label} is required.`
}

export function validEmail(value: string): string | undefined {
  if (!value.trim()) return 'Email address is required.'
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(value.trim()) ? undefined : 'Enter a valid email address.'
}

export function validPassword(value: string): string | undefined {
  if (!value) return 'Password is required.'
  if (value.length < 8) return 'Password must be at least 8 characters.'
  if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
    return 'Password must include at least one letter and one number.'
  }
  return undefined
}

export function matchingPasswords(password: string, confirmation: string): string | undefined {
  if (!confirmation) return 'Confirm your password.'
  return password === confirmation ? undefined : 'Passwords do not match.'
}

export function requiredCheckbox(value: boolean, message: string): string | undefined {
  return value ? undefined : message
}

export function firstError(errors: ValidationErrors): string | undefined {
  return Object.values(errors)[0]
}
