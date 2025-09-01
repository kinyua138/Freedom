import { UIComponent } from '@/types';

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T;
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function sanitizeHtml(html: string): string {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

export function getComponentById(components: UIComponent[], id: string): UIComponent | undefined {
  return components.find(comp => comp.id === id);
}

export function getComponentIndex(components: UIComponent[], id: string): number {
  return components.findIndex(comp => comp.id === id);
}

export function moveComponent(
  components: UIComponent[],
  fromIndex: number,
  toIndex: number
): UIComponent[] {
  const newComponents = [...components];
  const [movedComponent] = newComponents.splice(fromIndex, 1);
  newComponents.splice(toIndex, 0, movedComponent);
  return newComponents;
}

export function exportToHtml(components: UIComponent[]): string {
  const componentHtml = components
    .map(comp => {
      // Convert component to HTML based on type
      switch (comp.type) {
        case 'Button':
          return `<button style="${generateStyleString(comp.style)}">${comp.props.text}</button>`;
        case 'Text':
          return `<${comp.props.tag} style="${generateStyleString(comp.style)}">${comp.props.text}</${comp.props.tag}>`;
        case 'Image':
          return `<img src="${comp.props.src}" alt="${comp.props.alt}" style="${generateStyleString(comp.style)}" />`;
        default:
          return `<div style="${generateStyleString(comp.style)}">${comp.props.text || ''}</div>`;
      }
    })
    .join('\n');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Page</title>
    <style>
        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
    </style>
</head>
<body>
    ${componentHtml}
</body>
</html>`;
}

function generateStyleString(style: any): string {
  const styleMap: Record<string, string> = {
    backgroundColor: `background-color: ${style.backgroundColor};`,
    color: `color: ${style.textColor};`,
    width: `width: ${style.width};`,
    height: `height: ${style.height};`,
    margin: `margin: ${style.margin.top}px ${style.margin.right}px ${style.margin.bottom}px ${style.margin.left}px;`,
    padding: `padding: ${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px;`,
    borderRadius: `border-radius: ${style.borderRadius};`,
    border: `border: ${style.borderWidth}px ${style.borderStyle} ${style.borderColor};`,
    fontSize: `font-size: ${style.fontSize};`,
    fontWeight: `font-weight: ${style.fontWeight};`,
    textAlign: `text-align: ${style.textAlign};`,
    opacity: `opacity: ${style.opacity};`,
    transform: `transform: rotate(${style.rotate}deg) scale(${style.scale});`,
  };

  return Object.values(styleMap).join(' ');
}
