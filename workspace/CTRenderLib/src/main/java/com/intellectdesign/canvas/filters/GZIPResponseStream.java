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

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.zip.GZIPOutputStream;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

/**
 * Class for Gzip response stream which extends Servlet Output Stream
 * 
 * @version 1.0
 */
public class GZIPResponseStream extends ServletOutputStream
{

	/**
	 * Constructor of GZIPResponseStream
	 * 
	 * @param HttpServletResponse
	 * @throws IOException
	 */

	public GZIPResponseStream(HttpServletResponse httpservletresponse) throws IOException
	{
		baos = null;
		gzipstream = null;
		closed = false;
		response = null;
		output = null;
		closed = false;
		response = httpservletresponse;
		output = httpservletresponse.getOutputStream();
		baos = new ByteArrayOutputStream();
		gzipstream = new GZIPOutputStream(baos);
	}

	/**
	 * To close the output stream
	 * 
	 * 
	 * @throws IOException
	 */

	public void close() throws IOException
	{
		if (closed)
		{
			throw new IOException("This output stream has already been closed");
		} else
		{
			gzipstream.finish();
			byte abyte0[] = baos.toByteArray();
			response.addHeader("Content-Length", Integer.toString(abyte0.length));
			response.addHeader("Content-Encoding", "gzip");
			output.write(abyte0);
			output.flush();
			output.close();
			closed = true;
			return;
		}
	}

	/**
	 * The flush method flushes the output stream and forces any buffered output bytes to be written out
	 * 
	 * @throws IOException
	 */
	public void flush() throws IOException
	{
		if (closed)
		{
			throw new IOException("Cannot flush a closed output stream");
		} else
		{
			gzipstream.flush();
			return;
		}
	}

	/**
	 * The write method writes to the output stream
	 * 
	 * @param int
	 * @throws IOException
	 */

	public void write(int i) throws IOException
	{
		if (closed)
		{
			throw new IOException("Cannot write to a closed output stream");
		} else
		{
			gzipstream.write((byte) i);
			return;
		}
	}

	/**
	 * The write method writes to the output stream
	 * 
	 * @param abyte0[]
	 * @throws IOException
	 */

	public void write(byte abyte0[]) throws IOException
	{
		write(abyte0, 0, abyte0.length);
	}

	/**
	 * The write method writes to the output stream
	 * 
	 * @param abyte0[]
	 * @param i
	 * @param j
	 * @throws IOException
	 */

	public void write(byte abyte0[], int i, int j) throws IOException
	{

		if (closed)
		{
			throw new IOException("Cannot write to a closed output stream");
		} else
		{
			gzipstream.write(abyte0, i, j);
			return;
		}
	}

	/**
	 * To check whether the output stream is closed or not
	 * 
	 * @return Returns true if output stream closed or not
	 * 
	 */

	public boolean closed()
	{
		return closed;
	}

	/**
	 * Used to reset
	 */
	public void reset()
	{
	}

	private ByteArrayOutputStream baos;
	private GZIPOutputStream gzipstream;
	private boolean closed;
	private HttpServletResponse response;
	private ServletOutputStream output;
}
