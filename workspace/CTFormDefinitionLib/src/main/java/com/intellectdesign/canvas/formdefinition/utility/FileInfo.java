/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.*/

package com.intellectdesign.canvas.formdefinition.utility;

import java.io.File;

/**
 * This class is used for setting and getting the current attributes of file. 
 * 
 * @version 1.0
 * 
 */
public class FileInfo
{
	private String filesize;
	private String filename;
	private String encryptedfilename;
	private File fileobj;
	private String attachmentrefno;
	private String attachmentuploadeddate;

	/**
	 * This method provides the uploaded file size in bytes
	 * 
	 * @return filesize - String value of File size in bytes
	 */

	public String getFilesize()
	{
		return filesize;
	}

	/**
	 * This method sets the size of the uploaded file in bytes
	 * 
	 * @param filesize - String value of the file size in bytes
	 */

	public void setFilesize(String filesize)
	{
		this.filesize = filesize;
	}

	/**
	 * This method provides the actual name of the uploaded file
	 * 
	 * @return FileName - String value of the file name
	 */

	public String getFilename()
	{
		return filename;
	}

	/**
	 * This method sets the actual name of the uploaded file
	 * 
	 * @param filename - String value of the file 
	 */

	public void setFilename(String filename)
	{
		this.filename = filename;
	}

	/**
	 * This method provides the Encrypted filename of the uploaded file
	 * 
	 * @return encryptedfilename - String value of the encrypted name of the uploaded file
	 */

	public String getEncryptedfilename()
	{
		return encryptedfilename;
	}

	/**
	 * This method sets the encrypted name for the file uploaded
	 * 
	 * @param encryptedfilename - String value of the encrypted file name
	 */

	public void setEncryptedfilename(String encryptedfilename)
	{
		this.encryptedfilename = encryptedfilename;
	}

	/**
	 * This method provides the uploaded file in file object
	 * 
	 * @return Fileobj - File object containing the uploaded file
	 */

	public File getFileobj()
	{
		return fileobj;
	}

	/**
	 * This method sets the uploaded file object 
	 * 
	 * @param fileobj - File object containing the uploaded file
	 */

	public void setFileobj(File fileobj)
	{
		this.fileobj = fileobj;
	}

	/**
	 * This method provides the string representation of FileInfo object values
	 * 
	 * @return toString - String representation of the FileInfo object
	 */

	public String toString()
	{
		return "filename =" + filename + ",encryptedfilename=" + encryptedfilename + ",filesize=" + filesize + "bytes"
			+ ",attachmentrefno=" + attachmentrefno;
	}

	/**
	 * This method provides the unique Reference Number of the file uploaded 
	 * 
	 * @return attachmentrefno - String value of the reference number of the uploaded file
	 */

	public String getAttachmentrefno()
	{
		return attachmentrefno;
	}

	/**
	 * This method sets a unique reference number to the file being uploaded
	 * 
	 * @param attachmentrefno - String value of the reference number to the uploaded file
	 */

	public void setAttachmentrefno(String attachmentrefno)
	{
		this.attachmentrefno = attachmentrefno;
	}

	/**
	 * This method provides the date of the file uploaded 
	 * 
	 * @return attachmentuploadeddate - String value of the uploaded date
	 */

	public String getAttachmentuploadeddate()
	{
		return attachmentuploadeddate;
	}

	/**
	 * This method sets the date of the upload 
	 * 
	 * @param attachmentuploadeddate - String value of the uploaded date
	 */

	public void setAttachmentuploadeddate(String attachmentuploadeddate)
	{
		this.attachmentuploadeddate = attachmentuploadeddate;
	}
}
