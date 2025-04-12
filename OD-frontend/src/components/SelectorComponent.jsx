import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const options = [
  { value: 'CONFIRMED', label: 'ПОДТВЕРЖДЕНО', backgroundColor: 'rgb(183, 255, 183)' },
  { value: 'PENDING', label: 'В ОБРАБОТКЕ', backgroundColor: 'rgb(255, 255, 184)' },
  { value: 'CANCELED', label: 'ОТМЕНЕНО', backgroundColor: 'rgb(248, 164, 164)' },
];

const CustomSelect = ({ currentStatus, onChange  }) => {
    const [selectedOption, setSelectedOption] = useState(
        options.find(option => option.value === currentStatus) || options[0]
    );
    
    useEffect(() => {
        // Синхронизация состояния с внешним currentStatus
        setSelectedOption(options.find(option => option.value === currentStatus) || options[0]);
    }, [currentStatus]);
    
    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption); // Обновление локального состояния
        onChange(selectedOption.value); // Передача нового значения в родительский компонент
    };

    const customStyles = {
        control: (provided) => ({
          ...provided,
          backgroundColor: 'transparent',
          borderColor: '#ccc',
          color: 'black', // Цвет текста в поле
          cursor: 'pointer',
        }),
        singleValue: (provided) => ({
          ...provided,
          color: 'black', // Цвет текста внутри поля
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.data.backgroundColor, // Всегда показываем цвет
          color: 'black', // Цвет текста всех элементов
          opacity: state.isFocused || state.isSelected || state.isHovered ? 1 : 0.7, // Уменьшаем непрозрачность при отсутствии фокуса/выбора
          '&:hover': {
            backgroundColor: state.data.backgroundColor,
            opacity: 1, // Подсветка при наведении
          },
          cursor: 'pointer',
        }),
    };            

    return (
        <Select
            value={selectedOption} // Текущий статус будет отображаться здесь
            onChange={handleChange}
            options={options}
            styles={customStyles}
            placeholder="Выберите статус" // Текст по умолчанию
        />
    );
};

export default CustomSelect;