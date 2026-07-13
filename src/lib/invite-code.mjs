export function readInviteCode(search) {
  return new URLSearchParams(search).get('code')?.trim() ?? ''
}
