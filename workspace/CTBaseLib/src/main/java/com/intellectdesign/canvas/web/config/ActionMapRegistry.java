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
package com.intellectdesign.canvas.web.config;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.w3c.dom.Document;
import org.w3c.dom.Node;

import com.intellectdesign.canvas.exceptions.common.BaseException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.spec.registry.CanvasRegistryBase;
import com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent;
import com.intellectdesign.canvas.spec.registry.ICanvasRegistryIndexer;
import com.intellectdesign.canvas.utils.ResourceLoaderUtils;
import com.intellectdesign.canvas.utils.XMLParser;
import com.intellectdesign.canvas.utils.XMLUtils;

/**
 * This is the central registry for all Action Maps used within the Canvas Framework.
 * 
 * This Registry is defined as a singleton and can be accessed using the getDefaultInstance() method. The default
 * instance of the registry will have the default indexer that uses the Screen code as the basis of indexing and
 * identification of the ActionMap configuration.
 * 
 * But there could be situations where an application may want custom indexing logic to be used. In such cases, the
 * application will have to create a custom registry instance like,
 * 
 * <pre>
 * {@code
 * 
 * ActionMapRegistry.setCustomInstanceIndexer(MyCustomIndexer.class);
 * ActionMapRegistry customRegistry = ActionMapRegistry.getCustomInstance();
 * 
 * }
 * </pre>
 * 
 * Note: Since this registry is created as a singleton, the call to setCustomInstanceIndexer() should be invoked before
 * the first call to getCustomInstance(). Any calls made to setCustomInstanceIndexer() post creation of the custom
 * instance will not have any effect on the custom instance of the registry.
 * 
 * @version 1.0
 */
public class ActionMapRegistry extends CanvasRegistryBase
{
	private static ActionMapRegistry singletonInstance = null;
	private static ActionMapRegistry customSingletonInstance = null;
	private static Class<?> customInstanceIndexerClass = null;
	private static final Logger LOGGER = Logger.getLogger("com.intellectdesign.canvas.web.config.ActionMapRegistry");
	private static boolean ignoreCustom = true;

	private List<ICanvasRegistryContent> actionMapCache = null;

	/**
	 * this method ref to ActionRegistry The default constructor for the Registry. Since this registry is modeled as a
	 * singleton, this is made private
	 * 
	 * @param ICanvasRegistery Indexer
	 */
	private ActionMapRegistry(ICanvasRegistryIndexer indexer)
	{
		super(indexer);
		actionMapCache = new ArrayList<ICanvasRegistryContent>();
	}

	/**
	 * Implementations that wish to use custom Indexing logic for Action Maps should first invoke this before creating a
	 * custom instance of ActionMapRegistry. Care should be taken that this is invoked before the first call to
	 * getCustomInstance(). Once a Custom Instance of the ActionMapRegistry gets created, any change to the indexer will
	 * not take effect
	 * 
	 * @param indexerClass The Indexer class that should used for Custom instance of ActionMapRegistry
	 */
	public static void setCustomInstanceIndexer(Class<?> indexerClass)
	{
		customInstanceIndexerClass = indexerClass;
	}

	/**
	 * This method returns the instance of the default Registry. The default registry is configured with the default
	 * indexer used by Canvas Framework
	 * 
	 * @return The default instance of the ActionMapRegistry
	 */
	public static ActionMapRegistry getDefaultInstance()
	{
		if (singletonInstance == null)
		{
			synchronized (ActionMapRegistry.class)
			{
				ActionMapRegistry temp = new ActionMapRegistry(new ActionMapIndexer());
				singletonInstance = temp;
			}
		}
		return singletonInstance;
	}

	/**
	 * This method returns the instance of the default Registry. The default registry is configured with the default
	 * indexer used by Canvas Framework
	 * 
	 * @return The default instance of the ActionMapRegistry
	 */
	public static ActionMapRegistry getCustomInstance()
	{
		if (customSingletonInstance == null)
		{
			synchronized (ActionMapRegistry.class)
			{
				ICanvasRegistryIndexer customIndexer = null;
				try
				{
					customIndexer = (ICanvasRegistryIndexer) ResourceLoaderUtils.createInstance(
							customInstanceIndexerClass, (Object[]) null);
				} catch (BaseException e)
				{
					LOGGER.cterror("CTBAS00043", e, customInstanceIndexerClass.getName());
					customIndexer = new ActionMapIndexer();
				}

				ActionMapRegistry temp = new ActionMapRegistry(customIndexer);
				customSingletonInstance = temp;
			}
		}
		return customSingletonInstance;
	}

	/**
	 * this method ref to Register XMLParser
	 * 
	 * @param contentSourcePath
	 * @throws BaseException
	 * @see com.intellectdesign.canvas.spec.registry.ICanvasRegistry#register(java.lang.String)
	 */
	@Override
	public void register(String contentSourcePath) throws BaseException
	{
		InputStream sourceData = null;
		XMLParser parser = null;
		try
		{
			sourceData = ResourceLoaderUtils.loadResource(contentSourcePath);
			// If no exception has been encountered, then the resource was loaded successfully. So try to parse it into
			// an XML

			if (ignoreCustom)
			{
				ActionMap.ActionMapBuilder builder = null;
				parser = new XMLParser(sourceData);
				String funcCode = null;
				String screenCode = null;
				String productCode = null;
				String subProdCode = null;
				String host = null;
				String actionClass = null;
				String handlerClass = null;

				int count = parser.getNodeCount("action-map");
				for (int i = 0; i < count; i++)
				{
					Node n = parser.getNode("action-map", i);
					funcCode = XMLParser.getAttributeValueAtNode(n, "funcCode");
					screenCode = XMLParser.getAttributeValueAtNode(n, "screenCode");
					productCode = XMLParser.getAttributeValueAtNode(n, "prodCode");
					subProdCode = XMLParser.getAttributeValueAtNode(n, "subProdCode");
					host = XMLParser.getAttributeValueAtNode(n, "host");
					actionClass = XMLParser.getValueAtNode(n, "action-class");
					handlerClass = XMLParser.getValueAtNode(n, "handler-class");

					builder = new ActionMap.ActionMapBuilder();
					builder.setProductCode(productCode).setSubProductCode(subProdCode).setFunctionCode(funcCode)
							.setHostCode(host).setScreenCode(screenCode).setActionClass(actionClass)
							.setHandlerClass(handlerClass);
					register(builder.build());
				}

			} else
			{
				Document xmlDoc = XMLUtils.parseXML(sourceData);
				// If the document has been loaded, then load the same into the internal registry.
				loadActionMapsFrom(xmlDoc);
			}
		} catch (Exception e)
		{
			throw new BaseException(e);
		} finally
		{
			// Finally close the stream
			ResourceLoaderUtils.closeStream(sourceData);
			parser = null;
		}
	}

	/**
	 * The content provided is added to the internal cache. In case the content is not an ActionMap, this will return
	 * false.
	 * 
	 * @param aContent The content to be added to the registry
	 * @return true, if the content was added successfully. false if the content is not an ActionMap
	 * @throws BaseException thrown if any error occurs while adding the content
	 * @see com.intellectdesign.canvas.spec.registry.CanvasRegistryBase#registerImpl(com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent)
	 */
	@Override
	protected boolean registerImpl(ICanvasRegistryContent aContent) throws BaseException
	{
		boolean regSuccess = false;
		if (aContent instanceof ActionMap)
		{
			ActionMap contentToAdd = (ActionMap) aContent;
			actionMapCache.add(contentToAdd);
			regSuccess = true;
		}
		return regSuccess;
	}

	/**
	 * this method ref to ActionMap Content Replace the original content with the new vesion
	 * 
	 * @param origContent The original content
	 * @param newContent The new content
	 * @throws BaseException Thrown if any error occurs while replacing the content
	 * @see com.intellectdesign.canvas.spec.registry.CanvasRegistryBase#replaceContent(com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent,
	 *      com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent)
	 */
	@Override
	protected void replaceContent(ICanvasRegistryContent origContent, ICanvasRegistryContent newContent)
			throws BaseException
	{
		if (newContent instanceof ActionMap && origContent instanceof ActionMap)
		{
			ActionMap contentToAdd = (ActionMap) newContent;
			// Ideally the position does not matter as this has no bearing in ActionMap identification. So delete the
			// origContent and add the new content
			actionMapCache.remove(origContent);
			actionMapCache.add(contentToAdd);
		}
	}

	/**
	 * Unregister a content from the registry
	 * 
	 * @param aContent The content to be unregistered
	 * @return true if the content could be removed. false otherwise
	 * @throws BaseException Thrown if any error occurs while unregistering the content
	 * @see com.intellectdesign.canvas.spec.registry.CanvasRegistryBase#unregisterImpl(com.intellectdesign.canvas.spec.registry.ICanvasRegistryContent)
	 */
	@Override
	protected boolean unregisterImpl(ICanvasRegistryContent aContent) throws BaseException
	{
		boolean unregSuccess = false;
		if (aContent instanceof ActionMap)
		{
			ActionMap contentToRemove = (ActionMap) aContent;
			unregSuccess = actionMapCache.remove(contentToRemove);
		}
		return unregSuccess;
	}

	/**
	 * Gets the iterator for the internal cache of action maps
	 * 
	 * @return The iterator for the internal cache of ActionMap
	 * @see com.intellectdesign.canvas.spec.registry.CanvasRegistryBase#registryIterator()
	 */
	@Override
	protected Iterator<ICanvasRegistryContent> registryIterator()
	{
		return actionMapCache.iterator();
	}

	/**
	 * This method loads the action maps from the XML document that is created by parsing the XML file having action map
	 * definitions
	 * 
	 * @param xmlDoc The Document root of the XML
	 * @throws BaseException Thrown if any error occurs while processing the XML
	 */
	private void loadActionMapsFrom(Document xmlDoc) throws BaseException
	{
		Map<String, Object> xmlDocData = XMLUtils.getDocumentAsMap(xmlDoc);
		// The root node is "action-mapping". Within that there is only one level of children with the key as
		// "action-map"
		List<Map<String, Object>> actionMapsList = (List<Map<String, Object>>) xmlDocData.get(XMLUtils.FIELD_CHILDREN);
		Map<String, Object> anActionMapData = null;
		int numMaps = actionMapsList.size();
		ActionMap.ActionMapBuilder builder = null;
		String productCode;
		String subprodCode;
		String functionCode;
		String hostCode;
		String screenCode;
		String overridable;
		String childConfigKey;
		Map<String, String> attribData;
		Map.Entry<String, String> anAttrib;
		Map<String, Object> childConfigData = null;
		for (int count = 0; count < numMaps; count++)
		{
			anActionMapData = actionMapsList.get(count);
			attribData = (Map<String, String>) anActionMapData.get(XMLUtils.FIELD_NODE_ATTRIBUTES);
			if (attribData.size() == 0)
			{
				continue;
			}

			productCode = attribData.remove(ActionMap.ATTRIB_PRODUCT_CODE);
			subprodCode = attribData.remove(ActionMap.ATTRIB_SUBPROD_CODE);
			functionCode = attribData.remove(ActionMap.ATTRIB_FUNCTION_CODE);
			hostCode = attribData.remove(ActionMap.ATTRIB_HOST_CODE);
			screenCode = attribData.remove(ActionMap.ATTRIB_SCREEN_CODE);
			overridable = attribData.remove(ActionMap.ATTRIB_OVERRIDABLE);

			builder = new ActionMap.ActionMapBuilder();
			// Set the key attributes retrieved.
			builder.setProductCode(productCode).setSubProductCode(subprodCode).setFunctionCode(functionCode)
					.setHostCode(hostCode).setScreenCode(screenCode).setOverridable(overridable);
			// What ever remaining attributes that are present are to be treated as custom attributes.
			if (attribData.size() > 0)
			{
				Iterator<Map.Entry<String, String>> attribIterator = attribData.entrySet().iterator();
				while (attribIterator.hasNext())
				{
					anAttrib = attribIterator.next();
					builder.setAttribute(anAttrib.getKey(), anAttrib.getValue());
				}
			}

			// Now retrieve the action class, handler class. Any other immediate child items are to be treated as custom
			// attributes
			List<Map<String, Object>> childConfigList = (List<Map<String, Object>>) anActionMapData
					.get(XMLUtils.FIELD_CHILDREN);
			int numChildren = childConfigList.size();
			for (int childCount = 0; childCount < numChildren; childCount++)
			{
				childConfigData = childConfigList.get(childCount);
				childConfigKey = (String) childConfigData.get(XMLUtils.FIELD_NODE_KEY);
				if (ActionMap.ELEM_ACTION_CLASS.equals(childConfigKey))
					builder.setActionClass((String) childConfigData.get(childConfigKey));
				else if (ActionMap.ELEM_HANDLER_CLASS.equals(childConfigKey))
					builder.setHandlerClass((String) childConfigData.get(childConfigKey));
				else
					builder.setAttribute(childConfigKey, (String) childConfigData.get(childConfigKey));
			}
			// Now that the action map is ready, add the same using the ICanvasRegistry.register API
			register(builder.build());
		}
	}
}
