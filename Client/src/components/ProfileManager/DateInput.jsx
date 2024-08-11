import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
const styles = {
  root: {
    "flex-direction": "row-reverse"
  }
};

function CalendarIcon() {
  return (
    <img
      className='mr-[8px] h-[14px] w-[14px] cursor-pointer'
      src={"/images/choose-file.svg"}
      alt='calendar'
    />
  );
}

export default function DateInput({value = null , setValue = null, onChange = null , placeholder = 'Choose Date' }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker

          slots={{
            openPickerIcon: CalendarIcon
          }}
          slotProps={{
            inputAdornment: {
              sx: {
                "position": "absolute",
                "left": "0",
              },
            },
            textField: {
              InputProps: {
                startAdornment: (
                  <svg className='mr-[8px] h-[14px] w-[22px]' width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                  </svg>
                ),
              },
              placeholder: placeholder,
            },
          }}
          
          onChange = {(e) => setValue(e)}
          className='w-full'
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}