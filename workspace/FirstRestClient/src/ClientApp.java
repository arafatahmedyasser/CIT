import java.util.List;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.GenericType;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import generated.Employee;


public class ClientApp {
	
	public static void main(String[] args) {
		Client client =ClientBuilder.newClient();
		WebTarget target = client.target("http://localhost:8080/FirstRESTServer/rest/test/");
/*		String plainText = target.request(MediaType.TEXT_PLAIN).get(String.class);
		System.out.println(plainText);
		String htmlText = target.request(MediaType.TEXT_HTML).get(String.class);
		System.out.println(htmlText);
		String xmlText = target.request(MediaType.TEXT_XML).get(String.class);
		System.out.println(xmlText);*/
		
		Employee xmlEmployee =target.path("102").request(MediaType.APPLICATION_XML).get(Employee.class);
		System.out.println(xmlEmployee.getName() +"-- "+xmlEmployee.getEmpid());
		
		Employee emp=new Employee(105, "Arafat", 16000);
		String message =target.request(MediaType.TEXT_PLAIN).put(Entity.entity(emp, MediaType.APPLICATION_XML),String.class);
		System.out.println(message);
		
		GenericType<List<Employee>> empList = new GenericType<List<Employee>>(){};
		List<Employee> eList =target.path("all").request(MediaType.APPLICATION_XML).get(empList);
		for(Employee e: eList){
			System.out.println("client  "+
		
					e.getEmpid() +"--"+e.getSalary());
		}
		
		
		
		
	}

}
