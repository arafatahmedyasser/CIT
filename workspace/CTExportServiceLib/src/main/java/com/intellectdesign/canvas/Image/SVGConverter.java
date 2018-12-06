/**
 * Copyright 2015. Intellect Design Arena Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to intellectdesign Financial Technology 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 * Author : Nithish.G
 */
package com.intellectdesign.canvas.Image;

import org.apache.batik.apps.rasterizer.Main;




public class SVGConverter
{

	private String securityStatus = "-scriptSecurityOff";
	//private String[] args;
	
	// Refer xmlgraphics.apache.org/batik/tools/rasterizer.html for documentation
	public void renderAsPng(String svgFile,String outputFormat, int width)   //Can accept height also
	{
		String[] args = {svgFile,"-m",outputFormat,"-w",Integer.toString(width),securityStatus};
		//System.out.println(svgFile+" -m "+"image/png "+"-w "+Integer.toString(width)+securityStatus);
	
		rasterize(args);
	}
	
	private void rasterize(String[] input)
	{
		Main m = new Main(input);
		m.execute();
	}
}
