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

package com.intellectdesign.canvas.formexport.htmlrenderer;

import java.io.IOException;
import java.io.Writer;

import org.apache.commons.lang.StringEscapeUtils;
import org.rendersnake.HtmlCanvas;
import org.rendersnake.internal.HtmlEscapeHandler;

import com.intellectdesign.canvas.logger.Logger;

/**
 * 
 * StringEscapeUtils is a helper class that can write a String with XML escaping.
 * 
 * 
 * This class has been initiated from FormExportManager.
 * 
 * The default class used for the escape handler was org.apache.commons.lang3.StringEscapeUtils has been replaced by
 * org.apache.commons.lang.StringEscapeUtils . Since we are using old commons lang jar
 * 
 * The Class need to be updated when the common lang jar is updated.
 * 
 * @version 1.0
 */
public class StringEscapeUtilsCustom implements HtmlEscapeHandler
{
	private static final Logger LOG = Logger.getLogger("org.rendersnake.internal");

	/**
	 * 
	 * Default Constructor
	 * 
	 */

	private StringEscapeUtilsCustom()
	{
	}

	/**
	 * Method to initiate the instance of StringEscapeUtilsCustom
	 * 
	 * @exception ClassNotFoundException
	 * @exception InstantiationException
	 * @exception IllegalAccessException
	 * 
	 */

	public static void init()
	{
		// Try to setup the HtmlEscapeHandler for HtmlCanvas
		// Log a warning if the apache commons handler is not available.
		// In that case, you must provide your own implementation to the
		// HtmlCanvas.HTML_ESCAPE_HANDLER static field.
		try
		{

			Class.forName("org.apache.commons.lang.StringEscapeUtils");
			HtmlEscapeHandler soleInstance = (HtmlEscapeHandler) Class.forName(
					"com.intellectdesign.canvas.formexport.htmlrenderer.StringEscapeUtilsCustom").newInstance();
			HtmlCanvas.HTML_ESCAPE_HANDLER = soleInstance;
		} catch (ClassNotFoundException e)
		{
			LOG.cterror("CTEXP00033", e);
		} catch (InstantiationException e)
		{
			LOG.cterror("CTEXP00034", e);
		} catch (IllegalAccessException e)
		{
			LOG.cterror("CTEXP00034", e);
		}
	}

	/**
	 * Method to escape HTML
	 * 
	 * @param out
	 * @param text
	 * @throws IOException
	 * 
	 */

	public void escapeHtml(Writer out, String text) throws IOException
	{
		out.append(StringEscapeUtils.escapeHtml(text));
	}

	/**
	 * Method to escape XML
	 * 
	 * @param out
	 * @param text
	 * @throws IOException
	 * 
	 */

	public void escapeXml(Writer out, String text) throws IOException
	{
		/**
		 * See google groups http://groups.google.com/groups?q=java+escape+xml&start =10&hl=en&lr=&ie
		 * =UTF-8&selm=JPyaOQm2Fo7O2PeLfDykYBAsjKGw%404ax.com&rnum=12
		 */
		for (int i = 0; i < text.length(); i++)
		{
			char c = text.charAt(i);
			int v = (int) c;
			if (v < 32 || v > 127 || v == 38 || v == 39 || v == 60 || v == 62 || v == 34)
			{
				// we must escape a character in format &#22;
				// 38 is ampersand &
				// 60 is smaller <
				// 62 is larger >
				// 34 is quote "
				// 39 is apos '
				out.append('&').append('#').append(Integer.toString(v, 10)).append(';');
			} else
			{
				out.append(c);
			}
		}
	}

	/**
	 * Method to escape Ecmascript
	 * 
	 * @param out
	 * @param text
	 * @throws IOException
	 * 
	 */

	public void escapeEcmascript(Writer out, String text) throws IOException
	{
		/**
		 * http://www.squarefree.com/securitytips/web-developers.html
		 */
		for (int i = 0; i < text.length(); i++)
		{
			char c = text.charAt(i);
			int v = (int) c;
			if (v == 92 || v == 47 || v == 34 || v == 39)
			{
				// we must escape a character in format &#22;
				// 92 is \
				// 47 is /
				// 34 is quote "
				// 39 is apos '
				out.append('&').append('#').append(Integer.toString(v, 10)).append(';');
			} else
			{
				out.append(c);
			}
		}
	}

	// http://www.fiveanddime.net/HTMLescapeCodes.html

	/**
	 * Method to escape ISOCharacters
	 * 
	 * @param out
	 * @param input
	 * @throws IOException
	 * 
	 */
	public static void escapeISOCharacters(Writer out, String input) throws IOException
	{
		for (int i = 0; i < input.length(); i++)
		{
			char each = input.charAt(i);
			int v = (int) each;
			if (v < 32 || v > 127)
			{
				out.append('&').append('#').append(Integer.toString(v, 10)).append(';');
			} else
			{
				out.append(each);
			}
		}
	}
}
