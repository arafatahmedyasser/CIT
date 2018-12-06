/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 */
package com.intellectdesign.canvas.servercomm.encryption.filters;

import java.io.CharArrayWriter;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;

/**
 * Class for Char Response Wrapper which extends HttpServletResponseWrapper
 * 
 * @version 1.0
 */
public class CharResponseWrapper extends HttpServletResponseWrapper
{
	private CharArrayWriter output;

	/**
	 * converts to string format
	 * 
	 * @return String
	 * @see java.lang.Object#toString()
	 */
	public String toString()
	{

		return output.toString();
	}

	/**
	 * call the super class for response
	 * 
	 * @param response
	 */
	public CharResponseWrapper(HttpServletResponse response)
	{
		super(response);
		output = new CharArrayWriter();
	}

	/**
	 * Returns a PrintWriter object that can send character text to the client.
	 * 
	 * @return PrintWriter
	 * @see javax.servlet.ServletResponseWrapper#getWriter()
	 */
	public PrintWriter getWriter()
	{
		return new PrintWriter(output);
	}
}
