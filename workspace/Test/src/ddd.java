

public class ddd
{
	public static void main(String[] args) throws ClassNotFoundException
	{
		
		ddd d=new ddd();
		d.ss();
	}
	
	public void ss() throws ClassNotFoundException
	{
		
		Class c1 = Class.forName("ddd"); // if you want to specify a class
		Class c = this.getClass();          // if you want to use the current class

		System.out.println("Package: "+c.getPackage()+"\nClass: "+c.getSimpleName()+"\nFull Identifier: "+c.getName());
	}

}
