export type MapType = 'SUPPORT' | 'HOTSPOT' | 'WINLOSE' | 'TURNOUT';

export function ensureMapType(type?: string): MapType {
  type = type?.toUpperCase();
  if (type !== 'SUPPORT' && type !== 'HOTSPOT' && type !== 'WINLOSE' && type !== 'TURNOUT'){
    return 'SUPPORT';
  }
  return type;
}
