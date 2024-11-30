import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

// function to fetch the data from the backend.
const Category = () => {

    const [category, setCategory] = useState([])

    useEffect(() => {
        axios.get('http://localhost:3000/auth/category')

        .then(result => {

            if(result.data.Status){
                setCategory(result.data.Result);
            }else{
                alert(result.data.Error)
            }

        })
        .catch(err => console.log(err))
    },[])

    const handleDelete = (id) => {
        axios.delete('http://localhost:3000/auth/delete_category/' + id)
        .then(result => {
          if(result.data.Status){
            // navigate('/dashboard/employee')
            window.location.reload()
          }else{
            alert(result.data.Error)
          }
        })
      }


  return (

    // this is the add category button in above the category list in the category section
    <div className='px-5 mt-5'>
        <div className='d-flex justify-content-center'>
            <h3>Category List</h3>
        </div>
        <Link to={'/dashboard/add_category'} className='btn btn-success '>Add category</Link>


        { /* display categorys in the form of table at the category section */ }

        <div className='mt-3'>
            <table className='table'>
                <thead>
                    <tr>
                        <th>
                            Name
                        </th>
                        <th>
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                {category.map((c, index) => (
                            <tr key={c.id || index}>
                                <td>{c.name}</td>
                                <td>
                                    <button className="btn btn-warning btn-sm" onClick={() => handleDelete(c.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default Category
