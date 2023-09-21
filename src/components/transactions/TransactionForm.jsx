import { PLACE_DATA } from '../../api/mock_data';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';

const toDateInputString = (date) => {
  // ISO String without the trailing 'Z' is fine 🙄
  // (toISOString returns something like 2020-12-05T14:15:74Z,
  // datetime-local HTML5 input elements expect 2020-12-05T14:15:74, without the (timezone) Z)
  //
  // the best thing about standards is that we have so many to chose from!
  if (!date) return null;
  if (typeof date !== Object) {
    date = new Date(date);
  }
  let asString = date.toISOString();
  return asString.substring(0, asString.indexOf('T'));
};

const validationRules = {
  user: {
    required: 'User is required',
    minLength: { value: 2, message: 'Min length is 2' },
  },
  date: { required: 'Date is required' },
  place: { required: 'Place is required' },
  amount: {
    valueAsNumber: true,
    required: 'Amount is required',
    min: { value: 1, message: 'min 1' },
    max: { value: 5000, message: 'max 5000' },
  },
};

function LabelInput({ label, name, type, validationRules, ...rest }) {
  const { register, errors } = useFormContext();

  const hasError = name in errors;

  return (
    <div className='mb-3'>
      <label htmlFor={name} className='form-label'>
        {label}
      </label>
      <input
        {...register(name, validationRules)}
        id={name}
        type={type}
        className='form-control'
        {...rest}
      />
      {hasError ? (
        <div className='form-text text-danger'>{errors[name].message}</div>
      ) : null}
    </div>
  );
}

function PlacesSelect({ name, places }) {
  const { register, errors } = useFormContext();

  const hasError = name in errors;

  return (
    <div className='mb-3'>
      <label htmlFor={name} className='form-label'>
        Places
      </label>
      <select {...register(name)} id={name} className='form-select'>
        <option defaultChecked value=''>
          -- Select a place --
        </option>
        {places.map(({ id, name }) => (
          <option key={id} value={name}>
            {name}
          </option>
        ))}
      </select>
      {hasError ? (
        <div className='form-text text-danger'>{errors[name]}</div>
      ) : null}
    </div>
  );
}

export default function TransactionForm({ onSaveTransaction }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(JSON.stringify(data));
    const { user, place, amount, date } = data;
    onSaveTransaction(user, place, parseInt(amount), date);
    reset();
  };

  return (
    <>
      <h2>Add transaction</h2>
      <FormProvider
        handleSubmit={handleSubmit}
        errors={errors}
        register={register}
      >
        <form onSubmit={handleSubmit(onSubmit)} className='mb-5'>
          <div className='mb-3'>
            <LabelInput
              label='User'
              name='user'
              type='user'
              validationRules={validationRules.user}
            />
          </div>

          <div className='mb-3'>
            <LabelInput
              label='Date'
              name='date'
              type='date'
              validationRules={validationRules.date}
            />
          </div>

          <div className='mb-3'>
            <PlacesSelect name='place' places={PLACE_DATA} />
          </div>

          <div className='mb-3'>
            <LabelInput
              label='Amount'
              name='amount'
              type='amount'
              validationRules={validationRules.amount}
            />
          </div>

          <div className='clearfix'>
            <div className='btn-group float-end'>
              <button type='submit' className='btn btn-primary'>
                Add transaction
              </button>
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
