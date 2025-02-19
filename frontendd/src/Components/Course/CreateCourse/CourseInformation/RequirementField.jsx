import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { Button } from '@material-tailwind/react'
import { TextField } from '@mui/material'
const RequirementField = ({
    name,
    label,
    register,
    setValue,
    errors,
    getValues,
}) => {
    const {course, editCourse} = useSelector((state)=> state.course)
    const [requirement, setRequirement] = useState("")
    const [requirementsList, setRequirementsList] = useState([]) 

    useEffect(() => { 
      if(editCourse){
        // console.log("In requirements field, 1st render, editCourse=true course is",course)
        setRequirementsList(JSON.parse(course?.instructions));
      }
      register(name, {required:true, validate: (value)=> value.length > 0 })
      
    }, [])

    useEffect(() => {
        setValue(name, requirementsList)
    }, [requirementsList])
    
    const handleAddRequirement = () => {
        if(requirement){
            setRequirementsList([...requirementsList,requirement])
            setRequirement("")
        }
    }

    const handleRemoveRequirement = (index) => {
        const updatedRequirements = [...requirementsList]
        updatedRequirements.splice(index, 1)
        setRequirementsList(updatedRequirements)
    }

  return (
    <div className="flex flex-col m-auto space-x-2 space-y-2">
      <label className="text-sm text-slate-950" htmlFor={name}>
        {label} <sup className="text-pink-200">*</sup>
      </label>
      <div className="flex flex-col items-start space-y-2">
        <TextField
          fullWidth
          type="text"
          id={name}
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          className="w-full "
        />
        <Button
          type="button"
          onClick={handleAddRequirement}
          className="font-semibold bg-slate-600 text-yellow-50"
        >
          Add
        </Button>
      </div>
      
      
      {requirementsList.length > 0 && (
        <ul className="mt-2 list-disc list-inside">
          {requirementsList.map((requirement, index) => (
            <li key={index} className="flex items-center text-slate-950">
              <span>{requirement}</span>
              <Button
                type="button"
                className="ml-2 text-xs text-pure-greys-300 "
                onClick={() => handleRemoveRequirement(index)}
              >
                clear
              </Button>
            </li>
          ))}
        </ul>
      )}
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  )
}

export default RequirementField