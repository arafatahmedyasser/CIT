package com.cts.rest.server;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

@Path("/register")
public class ServerApp1 {
    
	@POST
	@Produces(MediaType.TEXT_HTML)
	public String produceHtmltext(@FormParam("username") String name,@FormParam("pno") long phone,@FormParam("email") String email){
  
		String res ="You are Registered Succesfully..Details Are";
		return "<h1><center>"+name+"</h1></center>";

	}
	
}
