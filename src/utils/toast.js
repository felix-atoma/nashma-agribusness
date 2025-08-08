import { createRoot } from 'react-dom/client';
import React from 'react';

class ToastService {
  constructor() {
    this.toastContainer = document.createElement('div');
    document.body.appendChild(this.toastContainer);
    this.root = createRoot(this.toastContainer);
    this.hasRendered = false;
  }

  success(message) {
    this.showToast(message, 'success');
  }

  error(message) {
    this.showToast(message, 'error');
  }

  info(message) {
    this.showToast(message, 'info');
  }

  warn(message) {
    this.showToast(message, 'warning');
  }

  async showToast(message, type) {
    if (!this.hasRendered) {
      const { default: ToastManager } = await import('../components/ToastManager');
      // Use React.createElement instead of JSX
      this.root.render(React.createElement(ToastManager));
      this.hasRendered = true;
    }

    const event = new CustomEvent('show-toast', {
      detail: { message, type },
    });
    window.dispatchEvent(event);
  }
}

export default new ToastService();