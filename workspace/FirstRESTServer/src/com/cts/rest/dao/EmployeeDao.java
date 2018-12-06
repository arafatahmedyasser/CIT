package com.cts.rest.dao;

import java.util.ArrayList;
import java.util.List;

import com.cts.rest.entity.Employee;


public class EmployeeDao {

	 List<Employee> elist = new ArrayList<Employee>();

	public EmployeeDao() {
		elist.add(new Employee(102, "Babu Raj", 12000));
		elist.add(new Employee(101, "Ajay Sharma", 11000));
		elist.add(new Employee(103, "Chandhu", 13000));
	}


	public Employee getEmployee(int empId){

		Employee emp=null;
		for(Employee e: elist){
			if(e.getEmpid()==empId){
				emp=new Employee(empId, e.getName(), e.getSalary());
			}

		}
		return emp;
	}


	public List<Employee> getEmployees() {
	
		return elist;
	}

	public void addEmployee(Employee e){

		elist.add(new Employee(e.getEmpid(), e.getName(),e.getSalary()));

	}

}
