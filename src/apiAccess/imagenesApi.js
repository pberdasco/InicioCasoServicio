import { apiBaseUrl_utils } from './apiUrls';

export class Imagenes {
  static async getProductImage(fotoDestruccionLink) {
    try {
      const productResponse = await fetch(apiBaseUrl_utils + 'upload/getfile/' + fotoDestruccionLink);
      const productImageData = await productResponse.blob();
      return URL.createObjectURL(productImageData);
    } catch (error) {
      console.error('Error fetching product image:', error);
      throw new Error('Error fetching product image');
    }
  }

  static async getInvoiceImage(fotoFacturaLink) {
    try {
      const invoiceResponse = await fetch(apiBaseUrl_utils + 'upload/getfile/' + fotoFacturaLink);
      if (fotoFacturaLink.endsWith('.pdf')) {
        const invoiceData = await invoiceResponse.arrayBuffer();
        const invoiceBlob = new Blob([invoiceData], { type: 'application/pdf' });
        return URL.createObjectURL(invoiceBlob);
      } else {
        const invoiceImageData = await invoiceResponse.blob();
        return URL.createObjectURL(invoiceImageData);
      }
    } catch (error) {
      console.error('Error fetching invoice image:', error);
      throw new Error('Error fetching invoice image');
    }
  }
}