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
 *
 */
package com.intellectdesign.canvas.filters;

import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;

// Referenced classes of package package com.intellectdesign.ppg.filter:
// GZIPResponseStream

/**
 * Class for Gzip response wrapper which extends Http Servlet Response Wrapper
 * 
 * @version 1.0
 */
public class GZIPResponseWrapper extends HttpServletResponseWrapper
{

	/**
	 * GZIPResponseWrapper constructor
	 * 
	 * @param httpservletresponse
	 */

	public GZIPResponseWrapper(HttpServletResponse httpservletresponse)
	{
		super(httpservletresponse);
		origResponse = null;
		stream = null;
		writer = null;
		origResponse = httpservletresponse;
	}

	/**
	 * To create the output stream
	 * 
	 * @return ServletOutputStream
	 * @throws IOException
	 */

	public ServletOutputStream createOutputStream() throws IOException
	{
		return new GZIPResponseStream(origResponse);
	}

	/**
	 * To finish response by closing the writer and stream
	 * 
	 * 
	 * @throws IOException
	 */

	public void finishResponse()
	{
		try
		{
			if (writer != null)
				writer.close();
			else if (stream != null)
				stream.close();
		} catch (IOException ioexception)
		{
		}
	}

	/**
	 * The flush method flushes the output stream and forces any buffered output bytes to be written out
	 * 
	 * @throws IOException
	 */

	public void flushBuffer() throws IOException
	{
		stream.flush();
	}

	/**
	 * To get the output stream
	 * 
	 * @return ServletOutputStream
	 * @throws IOException
	 */

	public ServletOutputStream getOutputStream() throws IOException
	{
		if (writer != null)
			throw new IllegalStateException("getWriter() has already been called!");
		if (stream == null)
			stream = createOutputStream();
		return stream;
	}

	/**
	 * To get the PrintWriter
	 * 
	 * @return PrintWriter
	 * @throws IOException
	 */

	public PrintWriter getWriter() throws IOException
	{
		if (writer != null)
			return writer;
		if (stream != null)
		{
			throw new IllegalStateException("getOutputStream() has already been called!");
		} else
		{
			stream = createOutputStream();
			writer = new PrintWriter(new OutputStreamWriter(stream, "UTF-8"));
			return writer;
		}
	}

	/**
	 * To set the ContentLength
	 * 
	 * @param i ContentLength to set
	 * 
	 */
	public void setContentLength(int i)
	{
	}

	private HttpServletResponse origResponse;
	private ServletOutputStream stream;
	private PrintWriter writer;
}
