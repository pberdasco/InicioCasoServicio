/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Imagenes } from '../../apiAccess/imagenesApi';


export const ModalFotos = ({ isOpen, onClose, row }) => {
  const [productImage, setProductImage] = useState(null);
  const [invoiceImage, setInvoiceImage] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const productImage = await Imagenes.getProductImage(row.fotoDestruccionLink);
        setProductImage(productImage);

        const invoiceImage = await Imagenes.getInvoiceImage(row.fotoFacturaLink);
        setInvoiceImage(invoiceImage);

      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    if (isOpen) {
      fetchImages();
    }
  }, [isOpen, row.fotoDestruccionLink, row.fotoFacturaLink]);

  return (
    // TODO: cambiar lg por xl si la pantalla es grande
    <Dialog open={isOpen} onClose={onClose} maxWidth="lg" fullWidth={true}>  
      <DialogTitle>Fotos del reclamo</DialogTitle>
      <DialogContent>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ flexBasis: '50%', marginRight: '20px' }}>
            {productImage && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ textAlign: 'center' }}>Producto</h4>
                <img src={productImage} alt="Foto del producto" style={{ maxWidth: '100%', marginBottom: '10px' }} />
              </div>
            )}
          </div>
          <div style={{ flexBasis: '50%' }}>
            {invoiceImage && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ textAlign: 'center' }}>Factura</h4>
                {row.fotoFacturaLink.endsWith('.pdf') ? (
                  <embed src={invoiceImage} type="application/pdf" width="100%" height="600px" />
                  
                ) : (
                  <img src={invoiceImage} alt="Foto de la factura" style={{ maxWidth: '100%', marginBottom: '10px' }} />
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};