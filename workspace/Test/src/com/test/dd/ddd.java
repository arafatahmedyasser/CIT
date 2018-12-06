package com.test.dd;

import java.util.EnumMap;


public class ddd
{

	enum Mobile {
		   Samsung("400"), Nokia("250"),Motorola("325");
		  
		   String price;
		   Mobile(String p) {
		      price = p;
		   }
		   String showPrice() {
		      return price;
		   } 
		}

		  

	public static void main(String[] args) 
	{
		System.out.println(Mobile.Nokia.showPrice());
		/*// create an enum
		 EnumMap<Numbers, String> map =
				   new EnumMap<Numbers, String>(Numbers.class);

				   // associate values in map
				   map.put(Numbers.ONE, "1");
				   map.put(Numbers.TWO, "2");
				   map.put(Numbers.THREE, "3");
				   map.put(Numbers.FOUR, "4");
				   
				   //System.out.println("Map: " + map.get(Numbers.FOUR));

				   // print the map
				   System.out.println("Map: " + map);
					  
				   // put something in Numbers.FIVE
				   String oldValue1 = map.put(Numbers.FIVE, "5");

				   // put something different in Number.ONE
				   String oldValue2 = map.put(Numbers.ONE, "20");

				   // print updated map
				   System.out.println("Updated Map: " + map);
				   System.out.println("First update returns:" + oldValue1);
				   System.out.println("Second update returns:" + oldValue2);  
	*/}
	public void ss() throws ClassNotFoundException
	{
		
		Class c1 = Class.forName("ddd"); // if you want to specify a class
		Class c = this.getClass();          // if you want to use the current class

		System.out.println("Package: "+c.getPackage()+"\nClass: "+c.getSimpleName()+"\nFull Identifier: "+c.getName());
	}

}
