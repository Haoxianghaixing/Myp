import React, { useEffect, useState } from 'react'
import { CSSObjectWithLabel } from 'react-select'
import AsyncSelect from 'react-select/async'

export interface SelectItem {
  id: string
  value: string
  label: string
  selected?: boolean
}

export interface KFSelectProps {
  selectClick: (idx: number) => void
  selectList: SelectItem[]
  width?: string
  fontSize?: string
}

const Select = (props: KFSelectProps) => {
  const { selectClick, selectList, width, fontSize = '12px' } = props
  const [selectedItem, setSelectItem] = useState<SelectItem>(selectList[0])

  const loadOptions = (
    inputValue: string,
    callback: (options: SelectItem[]) => void
  ) => {
    setTimeout(() => {
      if (!selectList) return
      callback(selectList.filter((item) => item.value.includes(inputValue)))
    }, 100)
  }

  useEffect(() => {
    if (selectedItem) return
    const idx = selectList.findIndex((item) => item.selected)
    if (idx !== undefined && idx !== -1) {
      setSelectItem(selectList[idx])
    }
  }, [])

  return (
    <AsyncSelect
      styles={{
        control: (baseStyles) =>
          ({
            ...baseStyles,
            width,
            fontSize: fontSize || '12px',
            height: '32px',
            minHeight: '32px',
          } as CSSObjectWithLabel),
        valueContainer: (baseStyles, props) =>
          ({
            ...baseStyles,
            height: '30px',
          } as CSSObjectWithLabel),
        indicatorsContainer: (baseStyles, props) =>
          ({
            ...baseStyles,
            height: '30px',
          } as CSSObjectWithLabel),
        indicatorSeparator: (baseStyles) => ({
          display: 'none',
        }),
        menuList: (baseStyles, props) =>
          ({
            ...baseStyles,
            backgroundColor: '#fff',
            borderRadius: '6px',
            boxShadow:
              '0px 15px 35px -2px rgba(0, 0, 0, 0.05), 0px 5px 15px rgba(0, 0, 0, 0.05)',
            padding: '6px',
          } as CSSObjectWithLabel),
        option: (baseStyles, { isSelected }) =>
          ({
            ...baseStyles,
            fontSize,
            backgroundColor: isSelected ? '#F7F6FA' : '#fff',
            color: isSelected ? '#7741FF' : '#070214',
            height: '32px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            ':hover': {
              backgroundColor: '#F7F6FA',
            },
            ':active': {
              backgroundColor: '#F7F6FA',
              color: '#7741FF',
            },
          } as CSSObjectWithLabel),
      }}
      value={selectedItem}
      onChange={(option) => {
        const idx = selectList.findIndex((item) => item.id === option?.id)
        if (idx !== undefined && idx !== -1) {
          setSelectItem(selectList[idx])
          selectClick(idx)
        }
      }}
      loadOptions={loadOptions}
      defaultOptions={selectList}
      isOptionSelected={(option) => Boolean(option.selected)}
    />
  )
}

export default Select
