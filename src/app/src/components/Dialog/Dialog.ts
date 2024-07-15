import Component from "../../../lib/Component";

export default Component(function () {
  const buttonRef = this.ref(undefined);
  const dialogRef = this.ref<HTMLDialogElement | undefined>(undefined);

  function openModal() {
    dialogRef.value?.showModal();
  }

  function closeModal() {
    dialogRef.value?.close();
  }

  return {
    dialogRef,
    buttonRef,
    openModal,
    closeModal,
  };
});
