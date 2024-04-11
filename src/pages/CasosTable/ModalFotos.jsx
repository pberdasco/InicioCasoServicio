/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

//! Mock
// import imagen1 from "../../assets/Completar.png";
// import imagen2 from '../../assets/Secuencia.png';

const apiBaseUrl = 'http://192.168.78.103:5002/';

export const ModalFotos = ({ isOpen, onClose, row }) => {
  const [productImage, setProductImage] = useState(null);
  const [invoiceImage, setInvoiceImage] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // TODO: descomentar despues de probar que llegue row
        const productResponse = await fetch(apiBaseUrl + 'upload/getfile/' + row.fotoDestruccionLink);
        const productImageData = await productResponse.blob();
        setProductImage(URL.createObjectURL(productImageData));

        const invoiceResponse = await fetch(apiBaseUrl + 'upload/getfile/' + row.fotoFacturaLink);
        const invoiceImageData = await invoiceResponse.blob();
        setInvoiceImage(URL.createObjectURL(invoiceImageData));

        //! Mock
        // setProductImage(imagen1);
        // setInvoiceImage(imagen2); 

      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    if (isOpen) {
      fetchImages();
    }
  }, [isOpen, row.fotoDestruccionLink, row.fotoFacturaLink]);

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="lg">
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
                <img src={invoiceImage} alt="Foto de la factura" style={{ maxWidth: '100%', marginBottom: '10px' }} />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

