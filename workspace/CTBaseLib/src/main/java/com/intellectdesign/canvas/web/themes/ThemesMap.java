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
package com.intellectdesign.canvas.web.themes;

import java.io.Serializable;

import com.intellectdesign.canvas.exceptions.common.BaseException;
import com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent;

/**
 * This is a simple value object that contains the definition of theme map. A theme map is a simple definition that
 * helps Canvas identify the target css for the themes.
 * 
 * A theme is defined as a combination of the following factors -
 * <ul>
 * <li><b>Theme Id</b> - The theme is identified by its ID</li>
 * <li><b>CONTEXT_ROOT</b> - The context root for the application/li>
 * <li><b>RELATIVE_PATH</b> -This will describe the path of the cssconfig.xml (Information about this file will be
 * explained later) along with the file name.</li>
 * </ul>
 * 
 * The css file for theme will be specified in the cssconfig.xml file. The following is the structure of the xml file.
 * 
 * <pre>
 * {@code
 * <?xml version="1.0" ?>
 * 	<theme id=#THEME_ID# mode=#MODE# folderRef=#RELATIVE_PATH#>
 * 	<css name=#FILE_NAME# />
 * 	</theme>
 * }
 * </pre>
 * 
 * 
 * @version 1.0
 */
public class ThemesMap implements Serializable, ICanvasRegistryContent
{
	/**
	 * this calss is ref to ThemeMap
	 */
	private static final long serialVersionUID = 1L;

	private String themeId;
	private String mode;
	private String relativePath;
	private String fileName;
	private boolean overridable;
	private String contextRoot;

	/**
	 * ref to Constructor
	 */
	public ThemesMap()
	{

	}

	/**
	 * this method refer to ThemesMap constructor
	 * 
	 * @param builder
	 */
	protected ThemesMap(ThemesBuilder builder)
	{
		this.themeId = builder.themeId;
		this.mode = builder.mode;
		this.relativePath = builder.relativePath;
		this.fileName = builder.fileName;
		this.contextRoot = builder.contextRoot;
	}

	/**
	 * method refer to ThemeID
	 * 
	 * @return the themeId
	 */
	public String getThemeId()
	{
		return themeId;
	}

	/**
	 * this method refer toSetThemesID
	 * 
	 * @param themeId the themeId to set
	 */
	public void setThemeId(String themeId)
	{
		this.themeId = themeId;
	}

	/**
	 * this method refer to GetMode
	 * 
	 * @return the mode
	 */
	public String getMode()
	{
		return mode;
	}

	/**
	 * This method refer toSetMode Object
	 * 
	 * @param mode the mode to set
	 */
	public void setMode(String mode)
	{
		this.mode = mode;
	}

	/**
	 * this method refer to RelativePath
	 * 
	 * @return the relativePath
	 */
	public String getRelativePath()
	{
		return relativePath;
	}

	/**
	 * this method refer to SetRelativePath
	 * 
	 * @param relativePath the relativePath to set
	 */
	public void setRelativePath(String relativePath)
	{
		this.relativePath = relativePath;
	}

	/**
	 * this method refer to FileName
	 * 
	 * @return the fileName
	 */
	public String getFileName()
	{
		return fileName;
	}

	/**
	 * this method refer to SetFileName
	 * 
	 * @param fileName the fileName to set
	 */
	public void setFileName(String fileName)
	{
		this.fileName = fileName;
	}

	/**
	 * this method refer to isOverridable
	 * 
	 * @return the overridable
	 */
	public boolean isOverridable()
	{
		return overridable;
	}

	/**
	 * this method refer to SetOverridable
	 * 
	 * @param overridable the overridable to set
	 */
	public void setOverridable(boolean overridable)
	{
		this.overridable = overridable;
	}

	/**
	 * this method refer to ContextRoot
	 * 
	 * @return the contextRoot
	 */
	public String getContextRoot()
	{
		return contextRoot;
	}

	/**
	 * this method refer to SetContextRoot
	 * 
	 * @param contextRoot the contextRoot to set
	 */
	public void setContextRoot(String contextRoot)
	{
		this.contextRoot = contextRoot;
	}

	/**
	 * this method refer CompareTo Object
	 * 
	 * @param o
	 * @return
	 * @see java.lang.Comparable#compareTo(java.lang.Object)
	 */
	@Override
	public int compareTo(Object compareObj)
	{
		int returnVal = -1;
		if (compareObj instanceof ThemesMap)
		{
			ThemesMap compareVal = (ThemesMap) compareObj;
			String currentValData = new StringBuilder().append(themeId).append(mode).append(contextRoot)
					.append(relativePath).append(fileName).toString();
			String compareValData = new StringBuilder().append(compareVal.themeId).append(compareVal.mode)
					.append(contextRoot).append(compareVal.relativePath).append(compareVal.fileName).toString();
			if (currentValData.equals(compareValData))
				returnVal = 0;
		}
		return returnVal;
	}

	/**
	 * this method refer to isOverrideAllowed
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent#isOverrideAllowed()
	 */
	@Override
	public boolean isOverrideAllowed()
	{
		return false;
	}

	/***
	 * Method too build the themes
	 * 
	 * @Version 1.0
	 */
	public static class ThemesBuilder
	{
		private String themeId;
		private String mode;
		private String relativePath;
		private String fileName;
		private boolean overridable;
		private String contextRoot;

		/**
		 * this method refer to ThemeId
		 * 
		 * @return the themeId
		 */
		public String getThemeId()
		{
			return themeId;
		}

		/**
		 * this method refer to SetthemeID
		 * 
		 * @param themeId the themeId to set
		 */
		public ThemesBuilder setThemeId(String themeId)
		{
			this.themeId = themeId;
			return this;
		}

		/**
		 * this method refer to GetMode
		 * 
		 * @return the mode
		 */
		public String getMode()
		{
			return mode;
		}

		/**
		 * this method refer to ThemeBuilderSetmode
		 * 
		 * @param mode the mode to set
		 */
		public ThemesBuilder setMode(String mode)
		{
			this.mode = mode;
			return this;
		}

		/**
		 * this method refer to GetRelativePathTheme
		 * 
		 * @return the relativePath
		 */
		public String getRelativePath()
		{
			return relativePath;
		}

		/**
		 * this method refer to SetRelativePathTheme
		 * 
		 * @param relativePath the relativePath to set
		 */
		public ThemesBuilder setRelativePath(String relativePath)
		{
			this.relativePath = relativePath;
			return this;
		}

		/**
		 * this method ref to FileName
		 * 
		 * @return the fileName
		 */
		public String getFileName()
		{
			return fileName;
		}

		/**
		 * this method ref to FileNameSet
		 * 
		 * @param fileName the fileName to set
		 */
		public ThemesBuilder setFileName(String fileName)
		{
			this.fileName = fileName;
			return this;
		}

		/**
		 * this method ref to Overridable
		 * 
		 * @return the overridable
		 */
		public boolean isOverridable()
		{
			return overridable;
		}

		/**
		 * this method ref to SetOverridable
		 * 
		 * @param overridable the overridable to set
		 */
		public ThemesBuilder setOverridable(boolean overridable)
		{
			this.overridable = overridable;
			return this;
		}

		/**
		 * this method ref to CotextRoot
		 * 
		 * @return the contextRoot
		 */
		public String getContextRoot()
		{
			return contextRoot;
		}

		/**
		 * this method ref to SetContext String
		 * 
		 * @param contextRoot the contextRoot to set
		 */
		public ThemesBuilder setContextRoot(String contextRoot)
		{
			this.contextRoot = contextRoot;
			return this;
		}

		/**
		 * this method ref to ThemeBuild
		 * 
		 * @return
		 * @throws BaseException
		 */
		public ThemesMap build() throws BaseException
		{
			return new ThemesMap(this);
		}

	}

}
