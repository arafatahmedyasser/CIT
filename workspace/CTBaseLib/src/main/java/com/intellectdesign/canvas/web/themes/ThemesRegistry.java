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

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.w3c.dom.Node;

import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.SystemPreferenceDescriptor;
import com.intellectdesign.canvas.exceptions.common.BaseException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.spec.registry.CanvasRegistryBase;
import com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent;
import com.intellectdesign.canvas.spec.registry.ICanvasRegistryIndexer;
import com.intellectdesign.canvas.utils.ResourceLoaderUtils;
import com.intellectdesign.canvas.utils.XMLParser;

/**
 * This class is for ThemesRegistry containing CanvasRegistryBase
 * 
 * @version 1.0
 */
public class ThemesRegistry extends CanvasRegistryBase
{
	/**
	 * this class is ref to ThemeRegistry Instances class
	 */
	private static ThemesRegistry singletonInstance = null;
	private static ThemesRegistry customSingletonInstance = null;
	private static Class<?> customInstanceIndexerClass = null;

	private static final Logger LOGGER = Logger.getLogger("com.intellectdesign.canvas.web.themes.ThemesRegistry");
	private static boolean ignoreCustomTheme = false;
	private List<ICanvasRegistryContent> themeCache = null;

	/**
	 * This method is used to ThemesRegistry
	 * 
	 * @param indexr
	 */
	public ThemesRegistry(ICanvasRegistryIndexer indexr)
	{
		super(indexr);
		themeCache = new ArrayList<ICanvasRegistryContent>();

	}

	/**
	 * Implementations that wish to use custom Indexing logic for Theme Maps should first invoke this before creating a
	 * custom instance of ThemesRegistry. Care should be taken that this is invoked before the first call to
	 * getCustomInstance(). Once a Custom Instance of the ThemesRegistry gets created, any change to the indexer will
	 * not take effect
	 * 
	 * @param indexerClass The Indexer class that should used for Custom instance of ThemesRegistry
	 */
	private static void setCustomInstanceIndexer(Class<?> indexerClass)
	{
		customInstanceIndexerClass = indexerClass;
	}

	/**
	 * This method returns the instance of the default Registry. The default registry is configured with the default
	 * indexer used by Canvas Framework
	 * 
	 * @return The default instance of the ThemesRegistry
	 */
	public static ThemesRegistry getDefaultInstance()
	{
		if (singletonInstance == null)
		{
			synchronized (ThemesRegistry.class)
			{
				ThemesRegistry temp = new ThemesRegistry(new ThemesIndexer());
				singletonInstance = temp;
			}
		}
		return singletonInstance;
	}

	/**
	 * This method returns the instance of the default Registry. The default registry is configured with the default
	 * indexer used by Canvas Framework
	 * 
	 * @return The default instance of the ThemesRegistry
	 */
	public static ThemesRegistry getInstance()
	{
		if (customSingletonInstance == null)
		{
			synchronized (ThemesRegistry.class)
			{
				ICanvasRegistryIndexer customIndexer = null;
				try
				{
					setCustomInstanceIndexer(ThemesIndexer.class);
					customIndexer = (ICanvasRegistryIndexer) ResourceLoaderUtils.createInstance(
							customInstanceIndexerClass, (Object[]) null);
				} catch (BaseException e)
				{
					// Okay, Error while loading custom class. Revert to default loading after logging the same.
					LOGGER.cterror("CTBAS00043", e, customInstanceIndexerClass.getName());
					customIndexer = new ThemesIndexer();
				}

				ThemesRegistry temp = new ThemesRegistry(customIndexer);
				customSingletonInstance = temp;
			}
		}
		ThemesRegistry.ignoreCustomTheme = true;
		return customSingletonInstance;
	}

	/**
	 * This method register the theme
	 * 
	 * @param themeId
	 * @param contextPath - It is the context path of the application eg('/CTModelHouse')
	 * @param cssConfigPath- It is the real path of the cssconfig.xml file
	 *            eg('D:/JBoss/server/default/deploy/CTModelHouse.war/css/style/blue/cssConfig.xml')
	 * @throws BaseException
	 * @see com.intellectdesign.canvas.spec.registry.ICanvasRegistry#register(java.lang.String)
	 */
	public void register(String contextPath, String cssConfigPath) throws BaseException
	{
		InputStream sourceData = null;
		XMLParser parser = null;
		try
		{
			sourceData = ResourceLoaderUtils.loadResource(cssConfigPath);
			// If no exception has been encountered, then the resource was loaded successfully. So try to parse it into
			// an XML

			ThemesMap.ThemesBuilder builder = null;
			parser = new XMLParser(sourceData);
			String theme = null;
			String mode = null;
			String folderPath = null;
			String fileName = null;

			int count = parser.getNodeCount("theme");
			for (int i = 0; i < count; i++)
			{
				Node n = parser.getNode("theme", i);
				theme = XMLParser.getAttributeValueAtNode(n, "id");
				mode = XMLParser.getAttributeValueAtNode(n, "mode");
				folderPath = XMLParser.getAttributeValueAtNode(n, "folderRef");

				Node childNode = n.getFirstChild().getNextSibling();
				if (n.hasChildNodes())
				{
					if (childNode.getNodeName().equals("css"))
					{
						if (ignoreCustomTheme)
						{
							fileName = XMLParser.getAttributeValueAtNode(childNode, "name");
						} else
						{
							fileName = mode + "-" + theme + ".css";
						}
					} else
					{
						LOGGER.cterror("CTBAS00078");
						return;
					}
				} else
				{
					LOGGER.cterror("CTBAS00078");
					return;
				}

				builder = new ThemesMap.ThemesBuilder();
				builder.setThemeId(theme).setMode(mode).setRelativePath(folderPath)
						.setContextRoot(contextPath.replace("/", "")).setFileName(fileName);
				register(builder.build());
			}

		} catch (Exception e)
		{
			LOGGER.cterror("CTBAS00079", e);
			throw new BaseException(e);
		} finally
		{
			// Finally close the stream
			ResourceLoaderUtils.closeStream(sourceData);
			parser = null;
		}
	}

	/**
	 * this method registerImpl
	 * 
	 * @param aContent
	 * @return
	 * @throws BaseException
	 * @see com.intellectdesign.canvas.spec.registry.CanvasRegistryBase#registerImpl(com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent)
	 */
	@Override
	protected boolean registerImpl(ICanvasRegistryContent aContent) throws BaseException
	{
		boolean regSuccess = false;
		if (aContent instanceof ThemesMap)
		{
			ThemesMap contentToAdd = (ThemesMap) aContent;
			themeCache.add(contentToAdd);
			regSuccess = true;
		}
		return regSuccess;
	}

	/**
	 * this method register ReplaceContent
	 * 
	 * @param origContent
	 * @param aContent
	 * @throws BaseException
	 * @see com.intellectdesign.canvas.spec.registry.CanvasRegistryBase#replaceContent(com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent,
	 *      com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent)
	 */
	@Override
	protected void replaceContent(ICanvasRegistryContent origContent, ICanvasRegistryContent aContent)
			throws BaseException
	{
		if (aContent instanceof ThemesMap && origContent instanceof ThemesMap)
		{
			ThemesMap contentToAdd = (ThemesMap) aContent;
			// Ideally the position does not matter as this has no bearing in ThemesMap identification. So delete the
			// origContent and add the new content
			themeCache.remove(origContent);
			themeCache.add(contentToAdd);
		}
	}

	/**
	 * This methos register UnRegisterImpl
	 * 
	 * @param aContent
	 * @return
	 * @throws BaseException
	 * @see com.intellectdesign.canvas.spec.registry.CanvasRegistryBase#unregisterImpl(com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent)
	 */
	@Override
	protected boolean unregisterImpl(ICanvasRegistryContent aContent) throws BaseException
	{
		boolean unregSuccess = false;
		if (aContent instanceof ThemesMap)
		{
			ThemesMap contentToRemove = (ThemesMap) aContent;
			unregSuccess = themeCache.remove(contentToRemove);
		}
		return unregSuccess;
	}

	/**
	 * This method register Iterator
	 * 
	 * @return
	 * @see com.intellectdesign.canvas.spec.registry.CanvasRegistryBase#registryIterator()
	 */
	@Override
	protected Iterator<ICanvasRegistryContent> registryIterator()
	{
		return themeCache.iterator();
	}

	/**
	 * This methosd Register object
	 * 
	 * @param contentSourcePath
	 * @throws BaseException
	 * @see com.intellectdesign.canvas.spec.registry.ICanvasRegistry#register(java.lang.String)
	 */
	@Override
	public void register(String contentSourcePath) throws BaseException
	{
		throw new BaseException(
				"This version is not supported. Please use the register method that takes in the context path also");
	}

	/**
	 * The method is used to get the theme object for the corresponding theme id.
	 * 
	 * @param themeId
	 * @param mode
	 * @param contextPath
	 * @return
	 * @throws BaseException
	 */
	public static ThemesMap getTheme(String themeId, String mode, String contextPath) throws BaseException
	{
		ThemesMap themeMap = null;
		ThemesRegistry registry = null;

		if ("canvas".equals(themeId))
		{
			registry = ThemesRegistry.getDefaultInstance();
			themeMap = (ThemesMap) registry.lookup(mode + "-" + themeId + "-" + contextPath);
		}

		else
		{

			if (validateTheme(themeId, mode, contextPath))
			{
				registry = ThemesRegistry.getInstance();
				themeMap = (ThemesMap) registry.lookup(mode + "-" + themeId + "-" + contextPath);
			} else
			{
				ConfigurationManager conf = ConfigurationManager.getInstance();
				SystemPreferenceDescriptor desc = conf.getSystemPrefDescriptor();
				if (validateTheme(desc.getDefaultTheme(), mode, contextPath))
				{
					themeId = desc.getDefaultTheme();
					registry = ThemesRegistry.getInstance();
					themeMap = (ThemesMap) registry.lookup(mode + "-" + themeId + "-" + contextPath);

				} else
				{
					themeId = "canvas";
					registry = ThemesRegistry.getDefaultInstance();
					themeMap = (ThemesMap) registry.lookup(mode + "-" + themeId + "-" + contextPath);
				}
			}
		}

		return themeMap;
	}
	//CTCBXQ215F02_UPD Starts
	/**
	 * The method is used to get the fontsize object for the corresponding fontsize id.
	 * 
	 * @param fontSizeId
	 * @param contextPath
	 * @return
	 * @throws BaseException
	 */
		

	//CTCBXQ215F02_UPD ends
	/***
	 * Method to validate the Theme
	 * 
	 * @param id
	 * @param mode
	 * @param context
	 * @return
	 */
	private static boolean validateTheme(String id, String mode, String context)
	{
		try
		{
			ThemesRegistry themeReg = ThemesRegistry.getInstance();
			return (themeReg.lookup(mode + "-" + id + "-" + context) != null);
		} catch (BaseException exp)
		{
			LOGGER.cterror("CTRND00382", exp);
			return false;
		}
	}

}
