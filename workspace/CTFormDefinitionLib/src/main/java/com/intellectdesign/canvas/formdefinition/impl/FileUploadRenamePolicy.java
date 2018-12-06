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

package com.intellectdesign.canvas.formdefinition.impl;

import java.io.File;

import com.oreilly.servlet.multipart.FileRenamePolicy;

/**
 * This class is repsonsible for renaming the uploaded file.
 * 
 * @version 1.0
 */
public class FileUploadRenamePolicy implements FileRenamePolicy
{

	// implement the rename(File f) method to satisfy the
	// FileRenamePolicy interface contract
	String id = null;

	/**
	 * This constructor takes the string value of the name to be appended with the upload file
	 * 
	 * @param id - String value of the file name to set
	 * 
	 */

	public FileUploadRenamePolicy(String id)
	{
		this.id = id;
	}

	/**
	 * This method gets the file to be renamed and returns the file with the renamed file
	 * 
	 * @param f - File object containing the file to be renamed
	 * @return renamedFile - File object containing the renamed file 
	 * 
	 */

	public File rename(File f)
	{

		// Get the parent directory path as in h:/home/user or /home/user
		String parentDir = f.getParent();

		// Get filename without its path location, such as 'index.txt'
		String fname = f.getName();

		// Get the extension if the file has one
		String fileExt = "";
		int i = -1;
		if ((i = fname.indexOf(".")) != -1)
		{

			fileExt = fname.substring(i);
			fname = fname.substring(0, i);
		}

		fname = fname + "_" + id;

		// piece together the filename
		fname = parentDir + System.getProperty("file.separator") + fname + fileExt;

		File temp = new File(fname);
		return temp;
	}

}
