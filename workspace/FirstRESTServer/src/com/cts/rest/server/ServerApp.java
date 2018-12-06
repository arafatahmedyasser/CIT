package com.cts.rest.server;
import java.util.List;

import javax.inject.Singleton;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.xml.bind.JAXBElement;

import com.cts.rest.dao.EmployeeDao;
import com.cts.rest.entity.Employee;

@Path("/test")
@Singleton
public class ServerApp {
	EmployeeDao empDao= null;

	/*	@GET
	//@Path("/html")
	@Produces(MediaType.TEXT_HTML)
	public String produceSimpleHtml(){
		return "<h1><center>Hello World HTML</center></h1>";
	}
	@GET
	//@Path("/xml")
	@Produces(MediaType.TEXT_XML)
	public String produceSimpleXml(){
		return "<Message> Hello World in XML </Message>";
	}

	@GET
	//@Path("/text")
	@Produces(MediaType.TEXT_PLAIN)
	public String produceSimpleText(){
		return "Hello world in Plain";
	}*/


	/*@GET
	@Path("/java8")
	@Produces("application/pdf")
	public Response downloadJava(){
		File file=new File("c:\\1.pdf");
		ResponseBuilder rb =Response.ok(file);
		rb.header("content-disposition", "attachment;filename=\"1.pdf\"");
		rb.header("cache-control", "must-revalidate");
		return rb.build();	

	}

	@GET
	@Path("/smiley")
	@Produces("image/jpg")
	public Response downloaJpg(){
		File file=new File("c:\\formatpainter.jpg");
		ResponseBuilder rb =Response.ok(file);
		rb.header("content-disposition", "attachment;filename=\"cts_smiley.jpg\"");
		rb.header("cache-control", "must-revalidate");
		return rb.build();	

	}*/

	public ServerApp(){
		empDao= new EmployeeDao();
	}
	
	
	@GET
	@Path("/{empId}")
	@Produces(MediaType.APPLICATION_XML)
	public Employee produceEmployee(@PathParam("empId") int empId){

		return empDao.getEmployee(empId);
	}


	@GET
	@Path("all")
	@Produces(MediaType.APPLICATION_XML)
	public List<Employee> produceEmployees(){

		return empDao.getEmployees();
	}


	@PUT
	@Produces(MediaType.TEXT_PLAIN)
	@Consumes(MediaType.APPLICATION_XML)
	public Response consumeEmployee(JAXBElement<Employee> emp)
	{
		Employee e=emp.getValue();
		empDao.addEmployee(e);
		return Response.status(200).entity("Succefully Added").build();
	}



}
