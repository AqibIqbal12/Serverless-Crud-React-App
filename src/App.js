import React, { useEffect, useState } from 'react';
import './App.css';
import { Formik, Form } from "formik";
import * as yup from "yup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { showAlert } from './util';


let formSchema = yup.object().shape({
  empName: yup.string().required("This field is required.").matches(/^[A-Za-z\s]*$/, "field should contain only letters."),
  empAge: yup.string().required("This field is required."),
  empSalary: yup.string().required("This field is required."),
});

const App = () => {

  const [employees, setEmployees] = useState([]);
  const [editEmpDtls, setEditEmpDtls] = useState({});
  const [isEditBtnClicked, setIsEditBtnClicked] = useState(false);
  const [isCollectionEmpty, setIsCollectionEmpty] = useState(false);

  useEffect(() => {
    fetch(`/.netlify/functions/show_employees`)
      .then(response => response.json())
      .then(data => {
        data.showAllEmp === 'Collection_is_empty' ? setIsCollectionEmpty(true) : setEmployees(data.showAllEmp);
      });

  }, []);


  const handleEdit = (id) => {
    fetch(`/.netlify/functions/edit_employee?ID=${id}`)
      .then(res => res.json())
      .then(data => {
        setEditEmpDtls(data);
        setIsEditBtnClicked(true);
      });
  }

  const handleDelete = (id) => {

    fetch(`/.netlify/functions/delete_employee?ID=${id}`, {
      method: "delete",
    })
      .then(res => res.json())
      .then(data => {
        
        if (data.deletedEntry === 'Collection_is_empty') {
          setIsCollectionEmpty(true);
          showAlert("Data deleted!!!", "success");
          setEmployees([]);
          setIsEditBtnClicked(false);
        }
        else {
          setEmployees(employees.filter((elem) => (elem.ref["@ref"].id !== data.deletedEntry.ref["@ref"].id)));
          showAlert("Data deleted!!!", "success");
          setIsEditBtnClicked(false); 
        }

      });
  }

  return (
    <div className="container">
      <div className="section">
        <h1>CRUD APP</h1>
        <div>
          <Formik
            enableReinitialize
            initialValues={{
              empName: !isEditBtnClicked ? '' : editEmpDtls.res.data.name,
              empAge: !isEditBtnClicked ? '' : editEmpDtls.res.data.age,
              empSalary: !isEditBtnClicked ? '' : editEmpDtls.res.data.salary,
            }}
            validationSchema={formSchema}
            onSubmit={(values, {resetForm}) => {
              if (!isEditBtnClicked) {

                fetch(`/.netlify/functions/add_employee`, {
                  method: 'post',
                  body: JSON.stringify(values)
                })
                  .then(response => response.json())
                  .then(data => {
                    setEmployees([data.newEmp, ...employees]);
                    showAlert("Data Saved Successfully!", "success");
                    setIsCollectionEmpty(false);
                  });
                  
                  resetForm({values: ''});
              }
              else {
                setIsEditBtnClicked(false);
                fetch(`/.netlify/functions/update_employee?ID=${editEmpDtls.res.ref["@ref"].id}`, {
                  method: 'put',
                  body: JSON.stringify(values)
                })
                  .then(response => response.json())
                  .then(data => {
                    setEmployees(
                      employees.map((elem) => {
                        if (elem.ref["@ref"].id === data.updatedData.ref["@ref"].id) {
                          elem.data.name = data.updatedData.data.name
                          elem.data.age = data.updatedData.data.age
                          elem.data.salary = data.updatedData.data.salary
                        }
                        return elem;
                      })
                    )
                    showAlert("Data Updated Successfully!", "success");
                  });
              }

            }}
          >
            {
              ({ errors, handleChange, touched, values }) => (
                <Form className="form">
                  <input
                    type="text"
                    id="empName"
                    value={values.empName}
                    name="empName"
                    onChange={handleChange}
                    placeholder="Name"
                    autoFocus
                    className="txtbox"
                  />
                  {errors.empName && touched.empName ? <p>{errors.empName}</p> : null}
                  <input
                    type="number"
                    id="empAge"
                    value={values.empAge}
                    name="empAge"
                    onChange={handleChange}
                    placeholder="Age"
                    className="txtbox"
                  />
                  {errors.empAge && touched.empAge ? <p>{errors.empAge}</p> : null}
                  <input
                    type="number"
                    id="empSalary"
                    value={values.empSalary}
                    name="empSalary"
                    onChange={handleChange}
                    placeholder="Salary"
                    className="txtbox"
                  />
                  {errors.empSalary && touched.empSalary ? <p>{errors.empSalary}</p> : null}
                  <br />
                  <button className="btn" type="submit">
                    {!isEditBtnClicked ? 'Add Employee' : 'Update Data'}
                  </button>
                </Form>
              )
            }
          </Formik>

          <ul>
            {
              isCollectionEmpty ? <h2 style={{ textAlign: "center" }}>There is no data in Collection!</h2> :
                employees.length === 0 ? <h2 style={{ textAlign: "center" }}>Loading </h2> :
                  employees.map((emp) => (
                    <li key={emp.ref["@ref"].id}>
                      <span >
                        <p>Name: {emp.data.name}</p>
                        <p>Age: {emp.data.age}</p>
                        <p>Salary: {emp.data.salary}</p>
                      </span>
                      <span >
                        <span style={{marginRight:"4px"}}>
                          <FontAwesomeIcon
                            icon={faEdit}
                            cursor="pointer"
                            onClick={() => handleEdit(emp.ref["@ref"].id)}
                            title="Edit"
                          />
                        </span>
                        <span>
                          <FontAwesomeIcon
                            icon={faTrash}
                            cursor="pointer"
                            onClick={() => handleDelete(emp.ref["@ref"].id)}
                            title="Delete"
                          />
                        </span>
                      </span>
                    </li>
                  ))
            }
          </ul>
        </div>
      </div>
    </div>
  )
}
export default App;
