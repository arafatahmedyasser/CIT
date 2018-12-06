

public class sampleloop
{
	 public static void main(String[] args) {
		 
		 for (int j = 0; j < 6; j++)
			{
				try{
					
					 int a[]=new int[3];
				        //Array has only 10 elements
					 System.out.println( "arafat "+j+"-----"+a.toString());
				        a[j] = 9;
				       
					
			}
				catch (Exception Excep)
				{
					
					Excep.printStackTrace();
					//continue;
				}

			}
	 }
}
