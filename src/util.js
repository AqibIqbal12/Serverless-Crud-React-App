import Swal from 'sweetalert2';

export const showAlert = (titleText, alertType) => {
    Swal.fire({
      titleText,
      position: 'top',
      timer: 2000,
      timerProgressBar: true,
      toast: true,
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: 'Dismiss',
      icon: alertType,
      showClass: {
        popup: 'swal2-noanimation',
        backdrop: 'swal2-noanimation',
      },
      hideClass: {
        popup: '',
        backdrop: '',
      },
    });
  };
  