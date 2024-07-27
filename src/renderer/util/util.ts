import Swal from 'sweetalert2';

export function showDeleteDialog(okProcess: () => void, message: string = '삭제할까요?') {
  Swal.fire({
    title: message,
    icon: 'warning',
    showCancelButton: true,
    showClass: {
      popup: '',
    },
    hideClass: {
      popup: '',
    },
  })
    .then((result) => {
      if (result.isConfirmed) {
        okProcess();
        return true;
      }
      return false;
    })
    .catch((error) => {
      showWarnDialog(`삭제 작업 중 오류가 발생했습니다.${error.toString()}`);
      console.error('삭제 작업 중 오류가 발생했습니다:', error);
    });
}

export function showWarnDialog(message: string) {
  Swal.fire({
    title: message,
    icon: 'warning',
    showClass: {
      popup: '',
    },
    hideClass: {
      popup: '',
    },
  });
}
