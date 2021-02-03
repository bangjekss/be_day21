import io from 'socket.io-client';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 10000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

export const api_url = 'http://localhost:2000';
export const socket = io(api_url + '/user');
export const socketAdmin = io(api_url + '/admin');
export const notification = (text) =>
  Toast.fire({
    icon: 'success',
    title: text,
  });
