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
package com.intellectdesign.canvas.webutil.compress;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.Reader;
import java.io.Writer;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.apache.commons.io.IOUtils;
import org.mozilla.javascript.ErrorReporter;
import org.mozilla.javascript.EvaluatorException;

import com.yahoo.platform.yui.compressor.JavaScriptCompressor;

/**
 * This class is for YuiCompressor
 * 
 * @version 1.0
 */
public class YuiCompressor
{
	/**
	 * this class is ref to Str i/p and O/p
	 * 
	 * @param args
	 */
	public static void main(String args[])
	{
		try
		{

			String inputFilename = "D:/Canvas/resource/original.js";
			String outputFilename = "D:/Canvas/resource/compressed.js";
			Options o = new Options();
			YuiCompressor.compressJavaScript(inputFilename, outputFilename, o);

		} catch (Exception e)
		{
			logger.log(Level.SEVERE, e.getMessage(), e);
		}
	}

	/**
	 * this class ref to YuiCompressorErrorReporter
	 */
	private static class YuiCompressorErrorReporter implements ErrorReporter
	{
		/**
		 * This method is used to YuiCompressorErrorReporter WarningErrors
		 * 
		 * @param message
		 * @param sourceName
		 * @param line
		 * @param lineSource
		 * @param lineOffset
		 * @see org.mozilla.javascript.ErrorReporter#warning(java.lang.String, java.lang.String, int, java.lang.String,
		 *      int)
		 */
		public void warning(String message, String sourceName, int line, String lineSource, int lineOffset)
		{
			if (line < 0)
			{
				logger.log(Level.WARNING, message);
			} else
			{
				logger.log(Level.WARNING, line + ':' + lineOffset + ':' + message);
			}
		}

		/**
		 * This method is used to Errors
		 * 
		 * @param message
		 * @param sourceName
		 * @param line
		 * @param lineSource
		 * @param lineOffset
		 * @see org.mozilla.javascript.ErrorReporter#error(java.lang.String, java.lang.String, int, java.lang.String,
		 *      int)
		 */
		public void error(String message, String sourceName, int line, String lineSource, int lineOffset)
		{
			if (line < 0)
			{
				logger.log(Level.SEVERE, message);
			} else
			{
				logger.log(Level.SEVERE, line + ':' + lineOffset + ':' + message);
			}
		}

		/**
		 * This methos is used to EvaluatorException RentimeErrors
		 * 
		 * @param message
		 * @param sourceName
		 * @param line
		 * @param lineSource
		 * @param lineOffset
		 * @return
		 * @see org.mozilla.javascript.ErrorReporter#runtimeError(java.lang.String, java.lang.String, int,
		 *      java.lang.String, int)
		 */
		public EvaluatorException runtimeError(String message, String sourceName, int line, String lineSource,
				int lineOffset)
		{
			error(message, sourceName, line, lineSource, lineOffset);
			return new EvaluatorException(message);
		}
	}

	/**
	 * This metod is used CompressJavaScript
	 * 
	 * @param inputFilename
	 * @param outputFilename
	 * @param o
	 * @throws IOException
	 */
	public static void compressJavaScript(String inputFilename, String outputFilename, Options o) throws IOException
	{
		Reader in = null;
		Writer out = null;
		try
		{
			in = new InputStreamReader(new FileInputStream(inputFilename), o.charset);

			JavaScriptCompressor compressor = new JavaScriptCompressor(in, new YuiCompressorErrorReporter());
			in.close();
			in = null;

			out = new OutputStreamWriter(new FileOutputStream(outputFilename), o.charset);
			compressor.compress(out, o.lineBreakPos, o.munge, o.verbose, o.preserveAllSemiColons,
					o.disableOptimizations);
		} finally
		{
			IOUtils.closeQuietly(in);
			IOUtils.closeQuietly(out);
		}
	}

	private static final Logger logger = Logger.getLogger(YuiCompressor.class.getName());

	public static class Options
	{
		public String charset = "UTF-8";
		public int lineBreakPos = -1;
		public boolean munge = true;
		public boolean verbose = false;
		public boolean preserveAllSemiColons = false;
		public boolean disableOptimizations = false;
	}

}
