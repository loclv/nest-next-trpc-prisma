'use client';

import { FieldErrors, useForm } from 'react-hook-form';

type TForm = {
  firstName: string;
};

export default function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TForm>();

  const onFormSubmit = (data: TForm) => console.log(data);
  const onErrors = (formErrors: FieldErrors<TForm>) =>
    console.error(formErrors);

  return (
    <form onSubmit={handleSubmit(onFormSubmit, onErrors)}>
      <input
        type="text"
        className="input input-bordered"
        {...register('firstName', { required: true, minLength: 6 })}
      />
      {errors.firstName && (
        <span className="text-error">
          First name is required (min 6 characters).
        </span>
      )}
      <button type="submit" className="btn">
        Submit
      </button>
    </form>
  );
}
