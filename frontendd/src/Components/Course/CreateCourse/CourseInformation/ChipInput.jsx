import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux'
import { GrFormClose } from "react-icons/gr"
import { TextField } from '@mui/material';
const ChipInput = ({
    label,
     name,
  placeholder,
  register,
  errors,
  setValue,
  getValues,
}) => {
    const {course, editCourse} = useSelector((state)=>state.course);
    const [chips, setChips] = useState([])

    useEffect(() => {
      register(name, {required:true, validate: (value)=> value.length > 0})

      if(editCourse) {
        console.log(course.tags)
        setChips(JSON.parse(course?.tags))
      }

    }, [])
    
    useEffect(() => {
      console.log(chips,name)
      setValue(name, chips)
    }, [chips])
    
    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const chipValue = e.target.value.trim();
            console.log(chipValue)

            if(chipValue ){
              console.log(chipValue)
                setChips([...chips, chipValue])
                e.target.value = ""
            }
        }
    }

    const handleDeleteChip = (chipIndex) => {
        const newChips = chips.filter((curr, ind) => ind!==chipIndex )
        setChips(newChips)
    }
  return (
    <div className="flex flex-col mx-2 space-y-2">
      {/* Render the label for the input */}
      <label className="text-sm text-slate-950" htmlFor={name}>
        {label} <sup className="text-pink-200">*</sup>
      </label>
      {/* Render the chips and input */}
      <div className="flex flex-wrap w-full gap-y-2">
        {/* Map over the chips array and render each chip */}
        
        {chips.map((chip, index) => (
          <div
            key={index}
            className="flex items-center px-2 py-1 m-1 text-sm bg-yellow-400 rounded-full text-slate-950"
          >

            {/* Render the chip value */}
            {chip}
            {/* Render the button to delete the chip */}
            <button
              type="button"
              className="ml-2 focus:outline-none"
              onClick={() => handleDeleteChip(index)}
            >
              <GrFormClose className="text-sm" />
            </button>

          </div>
        ))}

        
        {/* Render the input for adding new chips */}
       <TextField
         fullWidth
         label="Tags"
          id={name}
          name={name}
          type="text"
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          className="w-full "
        />
      </div>
      {/* Render an error message if the input is required and not filled */}
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  )
}

export default ChipInput