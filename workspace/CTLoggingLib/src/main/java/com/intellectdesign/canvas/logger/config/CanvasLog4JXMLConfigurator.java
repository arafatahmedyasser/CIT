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

package com.intellectdesign.canvas.logger.config;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InterruptedIOException;
import java.io.Reader;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.URL;
import java.net.URLConnection;
import java.util.Hashtable;
import java.util.Properties;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.FactoryConfigurationError;

import org.apache.log4j.Appender;
import org.apache.log4j.Layout;
import org.apache.log4j.Level;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.apache.log4j.config.PropertySetter;
import org.apache.log4j.helpers.FileWatchdog;
import org.apache.log4j.helpers.Loader;
import org.apache.log4j.helpers.LogLog;
import org.apache.log4j.helpers.OptionConverter;
import org.apache.log4j.or.RendererMap;
import org.apache.log4j.spi.AppenderAttachable;
import org.apache.log4j.spi.Configurator;
import org.apache.log4j.spi.ErrorHandler;
import org.apache.log4j.spi.Filter;
import org.apache.log4j.spi.LoggerFactory;
import org.apache.log4j.spi.LoggerRepository;
import org.apache.log4j.spi.RendererSupport;
import org.apache.log4j.xml.DOMConfigurator;
import org.apache.log4j.xml.Log4jEntityResolver;
import org.apache.log4j.xml.SAXErrorHandler;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

/**
 * This is the Log4J configurator used by Canvas. The logic of this class is kept exactly same as the
 * "org.apache.log4j.xml.DOMConfigurator" class and builds the support for passing dynamic properties object for
 * replacement into the dynamic variables present on the log4j configuration XML. This is a bug in the Log4J's
 * DomConfigurator where in it uses a Properties object as a member, but does not provide any option for the end user to
 * pass the same to the configurator.
 * 
 * @version 1.0
 */
public class CanvasLog4JXMLConfigurator implements Configurator
{
	static final String CONFIGURATION_TAG = "log4j:configuration";
	static final String OLD_CONFIGURATION_TAG = "configuration";
	static final String RENDERER_TAG = "renderer";
	private static final String THROWABLE_RENDERER_TAG = "throwableRenderer";
	static final String APPENDER_TAG = "appender";
	static final String APPENDER_REF_TAG = "appender-ref";
	static final String PARAM_TAG = "param";
	static final String LAYOUT_TAG = "layout";
	static final String CATEGORY = "category";
	static final String LOGGER = "logger";
	static final String LOGGER_REF = "logger-ref";
	static final String CATEGORY_FACTORY_TAG = "categoryFactory";
	static final String LOGGER_FACTORY_TAG = "loggerFactory";
	static final String NAME_ATTR = "name";
	static final String CLASS_ATTR = "class";
	static final String VALUE_ATTR = "value";
	static final String ROOT_TAG = "root";
	static final String ROOT_REF = "root-ref";
	static final String LEVEL_TAG = "level";
	static final String PRIORITY_TAG = "priority";
	static final String FILTER_TAG = "filter";
	static final String ERROR_HANDLER_TAG = "errorHandler";
	static final String REF_ATTR = "ref";
	static final String ADDITIVITY_ATTR = "additivity";
	static final String THRESHOLD_ATTR = "threshold";
	static final String CONFIG_DEBUG_ATTR = "configDebug";
	static final String INTERNAL_DEBUG_ATTR = "debug";
	private static final String RESET_ATTR = "reset";
	static final String RENDERING_CLASS_ATTR = "renderingClass";
	static final String RENDERED_CLASS_ATTR = "renderedClass";

	static final String EMPTY_STR = "";
	static final Class[] ONE_STRING_PARAM = new Class[]
	{ String.class };

	final static String dbfKey = "javax.xml.parsers.DocumentBuilderFactory";

	// key: appenderName, value: appender
	Hashtable appenderBag;

	Properties props;
	LoggerRepository repository;

	protected LoggerFactory catFactory = null;

	/**
	 * Set the runtime props into the parser
	 * 
	 * @param runtimeProps
	 */
	public void setRuntimeProps(Properties runtimeProps)
	{
		this.props = runtimeProps;
	}

	/**
	 * The default constructor
	 */
	public CanvasLog4JXMLConfigurator()
	{
		appenderBag = new Hashtable();
	}

	/**
	 * Configure by taking in an URL.
	 * 
	 * @param URL
	 * @param LoggerRepository
	 * @see org.apache.log4j.spi.Configurator#doConfigure(java.net.URL, org.apache.log4j.spi.LoggerRepository)
	 */
	@Override
	public void doConfigure(final URL url, LoggerRepository aRepository)
	{
		ParseAction action = new ParseAction()
		{
			/**
			 * Does parsing of the DocumentBuilder file
			 * 
			 * @param parser
			 * @return Document
			 * @throws SAXException
			 * @throws IOException
			 */
			public Document parse(final DocumentBuilder parser) throws SAXException, IOException
			{
				URLConnection uConn = url.openConnection();
				uConn.setUseCaches(false);
				InputStream stream = uConn.getInputStream();
				try
				{
					InputSource src = new InputSource(stream);
					src.setSystemId(url.toString());
					return parser.parse(src);
				} finally
				{
					stream.close();
				}
			}

			/**
			 * used to return the URL string
			 * 
			 * @return string
			 */
			public String toString()
			{
				return "url [" + url.toString() + "]";
			}
		};
		doConfigure(action, aRepository);
	}

	private interface ParseAction
	{
		Document parse(final DocumentBuilder parser) throws SAXException, IOException;
	}

	/**
	 * Configure by taking in a file name.
	 * 
	 * @param filename
	 * @param aRepository
	 */

	public void doConfigure(final String filename, LoggerRepository aRepository)
	{
		ParseAction action = new ParseAction()
		{
			public Document parse(final DocumentBuilder parser) throws SAXException, IOException
			{
				return parser.parse(new File(filename));
			}

			public String toString()
			{
				return "file [" + filename + "]";
			}
		};
		doConfigure(action, aRepository);
	}

	/**
	 * Used internally to parse appenders by IDREF name.
	 * 
	 * @param doc
	 * @param appenderName
	 * @return Appender
	 */
	protected Appender findAppenderByName(Document doc, String appenderName)
	{
		Appender appender = (Appender) appenderBag.get(appenderName);

		if (appender != null)
		{
			return appender;
		} else
		{
			// Doesn't work on DOM Level 1 :
			// Element element = doc.getElementById(appenderName);

			Element element = null;
			NodeList list = doc.getElementsByTagName("appender");
			for (int t = 0; t < list.getLength(); t++)
			{
				Node node = list.item(t);
				NamedNodeMap map = node.getAttributes();
				Node attrNode = map.getNamedItem("name");
				if (appenderName.equals(attrNode.getNodeValue()))
				{
					element = (Element) node;
					break;
				}
			}

			if (element == null)
			{
				LogLog.error("No appender named [" + appenderName + "] could be found.");
				return null;
			} else
			{
				appender = parseAppender(element);
				if (appender != null)
				{
					appenderBag.put(appenderName, appender);
				}
				return appender;
			}
		}
	}

	/**
	 * Used internally to parse appenders by IDREF element.
	 * 
	 * @param appenderRef
	 * @return Appender
	 */
	protected Appender findAppenderByReference(Element appenderRef)
	{
		String appenderName = subst(appenderRef.getAttribute(REF_ATTR));
		Document doc = appenderRef.getOwnerDocument();
		return findAppenderByName(doc, appenderName);
	}

	/**
	 * Delegates unrecognized content to created instance if it supports UnrecognizedElementParser.
	 * 
	 * 
	 * @param instance instance, may be null.
	 * @param element element, may not be null.
	 * @param props properties
	 * @throws Exception thrown if configuration of owner object should be abandoned.
	 */
	private static void parseUnrecognizedElement(final Object instance, final Element element, final Properties props)
			throws Exception
	{
		boolean recognized = false;
		/**
		 * if (instance instanceof UnrecognizedElementHandler) { recognized = ((UnrecognizedElementHandler)
		 * instance).parseUnrecognizedElement(element, props); }
		 */
		if (!recognized)
		{
			LogLog.warn("Unrecognized element " + element.getNodeName());
		}
	}

	/**
	 * Delegates unrecognized content to created instance if it supports UnrecognizedElementParser and catches and logs
	 * any exception.
	 * 
	 * 
	 * @param instance instance, may be null.
	 * @param element element, may not be null.
	 * @param props properties
	 * @exception InterruptedException
	 * @exception InterruptedIOException
	 */
	private static void quietParseUnrecognizedElement(final Object instance, final Element element,
			final Properties props)
	{
		try
		{
			parseUnrecognizedElement(instance, element, props);
		} catch (Exception ex)
		{
			if (ex instanceof InterruptedException || ex instanceof InterruptedIOException)
			{
				Thread.currentThread().interrupt();
			}
			LogLog.error("Error in extension content: ", ex);
		}
	}

	/**
	 * Used internally to parse an appender element.
	 * 
	 * @param appenderElement
	 * @return Appender
	 * @exception InterruptedException
	 * @exception InterruptedIOException
	 */
	protected Appender parseAppender(Element appenderElement)
	{
		String className = subst(appenderElement.getAttribute(CLASS_ATTR));
		LogLog.debug("Class name: [" + className + ']');
		try
		{
			Object instance = Loader.loadClass(className).newInstance();
			Appender appender = (Appender) instance;
			PropertySetter propSetter = new PropertySetter(appender);

			appender.setName(subst(appenderElement.getAttribute(NAME_ATTR)));

			NodeList children = appenderElement.getChildNodes();
			final int length = children.getLength();

			for (int loop = 0; loop < length; loop++)
			{
				Node currentNode = children.item(loop);

				/* We're only interested in Elements */
				if (currentNode.getNodeType() == Node.ELEMENT_NODE)
				{
					Element currentElement = (Element) currentNode;

					// Parse appender parameters
					if (currentElement.getTagName().equals(PARAM_TAG))
					{
						setParameter(currentElement, propSetter);
					}
					// Set appender layout
					else if (currentElement.getTagName().equals(LAYOUT_TAG))
					{
						appender.setLayout(parseLayout(currentElement));
					}
					// Add filters
					else if (currentElement.getTagName().equals(FILTER_TAG))
					{
						parseFilters(currentElement, appender);
					} else if (currentElement.getTagName().equals(ERROR_HANDLER_TAG))
					{
						parseErrorHandler(currentElement, appender);
					} else if (currentElement.getTagName().equals(APPENDER_REF_TAG))
					{
						String refName = subst(currentElement.getAttribute(REF_ATTR));
						if (appender instanceof AppenderAttachable)
						{
							AppenderAttachable aa = (AppenderAttachable) appender;
							LogLog.debug("Attaching appender named [" + refName + "] to appender named ["
									+ appender.getName() + "].");
							aa.addAppender(findAppenderByReference(currentElement));
						} else
						{
							LogLog.error("Requesting attachment of appender named [" + refName
									+ "] to appender named [" + appender.getName()
									+ "] which does not implement org.apache.log4j.spi.AppenderAttachable.");
						}
					} else
					{
						parseUnrecognizedElement(instance, currentElement, props);
					}
				}
			}
			propSetter.activate();
			return appender;
		}
		/**
		 * Yes, it's ugly. But all of these exceptions point to the same problem: we can't create an Appender
		 */
		catch (Exception oops)
		{
			if (oops instanceof InterruptedException || oops instanceof InterruptedIOException)
			{
				Thread.currentThread().interrupt();
			}
			LogLog.error("Could not create an Appender. Reported error follows.", oops);
			return null;
		}
	}

	/**
	 * Used internally to parse an {@link ErrorHandler} element.
	 * 
	 * @param element
	 * @param appender
	 */
	protected void parseErrorHandler(Element element, Appender appender)
	{
		ErrorHandler eh = (ErrorHandler) OptionConverter.instantiateByClassName(
				subst(element.getAttribute(CLASS_ATTR)), org.apache.log4j.spi.ErrorHandler.class, null);

		if (eh != null)
		{
			eh.setAppender(appender);

			PropertySetter propSetter = new PropertySetter(eh);
			NodeList children = element.getChildNodes();
			final int length = children.getLength();

			for (int loop = 0; loop < length; loop++)
			{
				Node currentNode = children.item(loop);
				if (currentNode.getNodeType() == Node.ELEMENT_NODE)
				{
					Element currentElement = (Element) currentNode;
					String tagName = currentElement.getTagName();
					if (tagName.equals(PARAM_TAG))
					{
						setParameter(currentElement, propSetter);
					} else if (tagName.equals(APPENDER_REF_TAG))
					{
						eh.setBackupAppender(findAppenderByReference(currentElement));
					} else if (tagName.equals(LOGGER_REF))
					{
						String loggerName = currentElement.getAttribute(REF_ATTR);
						Logger logger = (catFactory == null) ? repository.getLogger(loggerName) : repository.getLogger(
								loggerName, catFactory);
						eh.setLogger(logger);
					} else if (tagName.equals(ROOT_REF))
					{
						Logger root = repository.getRootLogger();
						eh.setLogger(root);
					} else
					{
						quietParseUnrecognizedElement(eh, currentElement, props);
					}
				}
			}
			propSetter.activate();
			appender.setErrorHandler(eh);
		}
	}

	/**
	 * Used internally to parse a filter element.
	 * 
	 * @param element
	 * @param appender
	 */
	protected void parseFilters(Element element, Appender appender)
	{
		String clazz = subst(element.getAttribute(CLASS_ATTR));
		Filter filter = (Filter) OptionConverter.instantiateByClassName(clazz, Filter.class, null);

		if (filter != null)
		{
			PropertySetter propSetter = new PropertySetter(filter);
			NodeList children = element.getChildNodes();
			final int length = children.getLength();

			for (int loop = 0; loop < length; loop++)
			{
				Node currentNode = children.item(loop);
				if (currentNode.getNodeType() == Node.ELEMENT_NODE)
				{
					Element currentElement = (Element) currentNode;
					String tagName = currentElement.getTagName();
					if (tagName.equals(PARAM_TAG))
					{
						setParameter(currentElement, propSetter);
					} else
					{
						quietParseUnrecognizedElement(filter, currentElement, props);
					}
				}
			}
			propSetter.activate();
			LogLog.debug("Adding filter of type [" + filter.getClass() + "] to appender named [" + appender.getName()
					+ "].");
			appender.addFilter(filter);
		}
	}

	/**
	 * Used internally to parse an category element.
	 * 
	 * @param loggerElement
	 * @exception InvocationTargetException
	 */
	protected void parseCategory(Element loggerElement)
	{
		// Create a new org.apache.log4j.Category object from the <category> element.
		String catName = subst(loggerElement.getAttribute(NAME_ATTR));

		Logger cat;

		String className = subst(loggerElement.getAttribute(CLASS_ATTR));

		if (EMPTY_STR.equals(className))
		{
			LogLog.debug("Retreiving an instance of org.apache.log4j.Logger.");
			cat = (catFactory == null) ? repository.getLogger(catName) : repository.getLogger(catName, catFactory);
		} else
		{
			LogLog.debug("Desired logger sub-class: [" + className + ']');
			try
			{
				Class clazz = Loader.loadClass(className);
				Method getInstanceMethod = clazz.getMethod("getLogger", ONE_STRING_PARAM);
				cat = (Logger) getInstanceMethod.invoke(null, new Object[]
				{ catName });
			} catch (InvocationTargetException oops)
			{
				if (oops.getTargetException() instanceof InterruptedException
						|| oops.getTargetException() instanceof InterruptedIOException)
				{
					Thread.currentThread().interrupt();
				}
				LogLog.error("Could not retrieve category [" + catName + "]. Reported error follows.", oops);
				return;
			} catch (Exception oops)
			{
				LogLog.error("Could not retrieve category [" + catName + "]. Reported error follows.", oops);
				return;
			}
		}

		// Setting up a category needs to be an atomic operation, in order
		// to protect potential log operations while category
		// configuration is in progress.
		synchronized (cat)
		{
			boolean additivity = OptionConverter.toBoolean(subst(loggerElement.getAttribute(ADDITIVITY_ATTR)), true);

			LogLog.debug("Setting [" + cat.getName() + "] additivity to [" + additivity + "].");
			cat.setAdditivity(additivity);
			parseChildrenOfLoggerElement(loggerElement, cat, false);
		}
	}

	/**
	 * Used internally to parse the category factory element.
	 * 
	 * @param factoryElement
	 */
	protected void parseCategoryFactory(Element factoryElement)
	{
		String className = subst(factoryElement.getAttribute(CLASS_ATTR));

		if (EMPTY_STR.equals(className))
		{
			LogLog.error("Category Factory tag " + CLASS_ATTR + " attribute not found.");
			LogLog.debug("No Category Factory configured.");
		} else
		{
			LogLog.debug("Desired category factory: [" + className + ']');
			Object factory = OptionConverter.instantiateByClassName(className, LoggerFactory.class, null);
			if (factory instanceof LoggerFactory)
			{
				catFactory = (LoggerFactory) factory;
			} else
			{
				LogLog.error("Category Factory class " + className
						+ " does not implement org.apache.log4j.LoggerFactory");
			}
			PropertySetter propSetter = new PropertySetter(factory);

			Element currentElement = null;
			Node currentNode = null;
			NodeList children = factoryElement.getChildNodes();
			final int length = children.getLength();

			for (int loop = 0; loop < length; loop++)
			{
				currentNode = children.item(loop);
				if (currentNode.getNodeType() == Node.ELEMENT_NODE)
				{
					currentElement = (Element) currentNode;
					if (currentElement.getTagName().equals(PARAM_TAG))
					{
						setParameter(currentElement, propSetter);
					} else
					{
						quietParseUnrecognizedElement(factory, currentElement, props);
					}
				}
			}
		}
	}

	/**
	 * Used internally to parse the roor category element.
	 * 
	 * @param rootElement
	 */
	protected void parseRoot(Element rootElement)
	{
		Logger root = repository.getRootLogger();
		// category configuration needs to be atomic
		synchronized (root)
		{
			parseChildrenOfLoggerElement(rootElement, root, true);
		}
	}

	/**
	 * Used internally to parse the children of a category element.
	 * 
	 * @param catElement
	 * @param cat
	 * @param isRoot
	 */
	protected void parseChildrenOfLoggerElement(Element catElement, Logger cat, boolean isRoot)
	{

		PropertySetter propSetter = new PropertySetter(cat);

		// Remove all existing appenders from cat. They will be
		// reconstructed if need be.
		cat.removeAllAppenders();

		NodeList children = catElement.getChildNodes();
		final int length = children.getLength();

		for (int loop = 0; loop < length; loop++)
		{
			Node currentNode = children.item(loop);

			if (currentNode.getNodeType() == Node.ELEMENT_NODE)
			{
				Element currentElement = (Element) currentNode;
				String tagName = currentElement.getTagName();

				if (tagName.equals(APPENDER_REF_TAG))
				{
					Element appenderRef = (Element) currentNode;
					Appender appender = findAppenderByReference(appenderRef);
					String refName = subst(appenderRef.getAttribute(REF_ATTR));
					if (appender != null)
						LogLog.debug("Adding appender named [" + refName + "] to category [" + cat.getName() + "].");
					else
						LogLog.debug("Appender named [" + refName + "] not found.");

					cat.addAppender(appender);

				} else if (tagName.equals(LEVEL_TAG))
				{
					parseLevel(currentElement, cat, isRoot);
				} else if (tagName.equals(PRIORITY_TAG))
				{
					parseLevel(currentElement, cat, isRoot);
				} else if (tagName.equals(PARAM_TAG))
				{
					setParameter(currentElement, propSetter);
				} else
				{
					quietParseUnrecognizedElement(cat, currentElement, props);
				}
			}
		}
		propSetter.activate();
	}

	/**
	 * Used internally to parse a layout element.
	 * 
	 * @param layout_element
	 * @return Layout instance
	 * @exception InterruptedException
	 * @exception InterruptedIOException
	 */
	protected Layout parseLayout(Element layout_element)
	{
		String className = subst(layout_element.getAttribute(CLASS_ATTR));
		LogLog.debug("Parsing layout of class: \"" + className + "\"");
		try
		{
			Object instance = Loader.loadClass(className).newInstance();
			Layout layout = (Layout) instance;
			PropertySetter propSetter = new PropertySetter(layout);

			NodeList params = layout_element.getChildNodes();
			final int length = params.getLength();

			for (int loop = 0; loop < length; loop++)
			{
				Node currentNode = params.item(loop);
				if (currentNode.getNodeType() == Node.ELEMENT_NODE)
				{
					Element currentElement = (Element) currentNode;
					String tagName = currentElement.getTagName();
					if (tagName.equals(PARAM_TAG))
					{
						setParameter(currentElement, propSetter);
					} else
					{
						parseUnrecognizedElement(instance, currentElement, props);
					}
				}
			}

			propSetter.activate();
			return layout;
		} catch (Exception oops)
		{
			if (oops instanceof InterruptedException || oops instanceof InterruptedIOException)
			{
				Thread.currentThread().interrupt();
			}
			LogLog.error("Could not create the Layout. Reported error follows.", oops);
			return null;
		}
	}

	/**
	 * used to parse the renderer
	 * 
	 * @param element
	 */
	protected void parseRenderer(Element element)
	{
		String renderingClass = subst(element.getAttribute(RENDERING_CLASS_ATTR));
		String renderedClass = subst(element.getAttribute(RENDERED_CLASS_ATTR));
		if (repository instanceof RendererSupport)
		{
			RendererMap.addRenderer((RendererSupport) repository, renderedClass, renderingClass);
		}
	}

	/**
	 * Parses throwable renderer.
	 * 
	 * @param element throwableRenderer element.
	 * @return configured throwable renderer.
	 * 
	 */
	/**
	 * protected ThrowableRenderer parseThrowableRenderer(final Element element) { String className =
	 * subst(element.getAttribute(CLASS_ATTR)); LogLog.debug("Parsing throwableRenderer of class: \"" + className +
	 * "\""); try { Object instance = Loader.loadClass(className).newInstance(); ThrowableRenderer tr =
	 * (ThrowableRenderer) instance; PropertySetter propSetter = new PropertySetter(tr);
	 * 
	 * NodeList params = element.getChildNodes(); final int length = params.getLength();
	 * 
	 * for (int loop = 0; loop < length; loop++) { Node currentNode = params.item(loop); if (currentNode.getNodeType()
	 * == Node.ELEMENT_NODE) { Element currentElement = (Element) currentNode; String tagName =
	 * currentElement.getTagName(); if (tagName.equals(PARAM_TAG)) { setParameter(currentElement, propSetter); } else {
	 * parseUnrecognizedElement(instance, currentElement, props); } } }
	 * 
	 * propSetter.activate(); return tr; } catch (Exception oops) { if (oops instanceof InterruptedException || oops
	 * instanceof InterruptedIOException) { Thread.currentThread().interrupt(); }
	 * LogLog.error("Could not create the ThrowableRenderer. Reported error follows.", oops); return null; } }
	 */

	/**
	 * Used internally to parse a level element.
	 * 
	 * @param element
	 * @param logger
	 * @param isRoot
	 * @exception InterruptedException
	 * @exception InterruptedIOException
	 * 
	 */
	protected void parseLevel(Element element, Logger logger, boolean isRoot)
	{
		String catName = logger.getName();
		if (isRoot)
		{
			catName = "root";
		}

		String priStr = subst(element.getAttribute(VALUE_ATTR));
		LogLog.debug("Level value for " + catName + " is  [" + priStr + "].");

		if (INHERITED.equalsIgnoreCase(priStr) || NULL.equalsIgnoreCase(priStr))
		{
			if (isRoot)
			{
				LogLog.error("Root level cannot be inherited. Ignoring directive.");
			} else
			{
				logger.setLevel(null);
			}
		} else
		{
			String className = subst(element.getAttribute(CLASS_ATTR));
			if (EMPTY_STR.equals(className))
			{
				logger.setLevel(OptionConverter.toLevel(priStr, Level.DEBUG));
			} else
			{
				LogLog.debug("Desired Level sub-class: [" + className + ']');
				try
				{
					Class clazz = Loader.loadClass(className);
					Method toLevelMethod = clazz.getMethod("toLevel", ONE_STRING_PARAM);
					Level pri = (Level) toLevelMethod.invoke(null, new Object[]
					{ priStr });
					logger.setLevel(pri);
				} catch (Exception oops)
				{
					if (oops instanceof InterruptedException || oops instanceof InterruptedIOException)
					{
						Thread.currentThread().interrupt();
					}
					LogLog.error("Could not create level [" + priStr + "]. Reported error follows.", oops);
					return;
				}
			}
		}
		LogLog.debug(catName + " level set to " + logger.getLevel());
	}

	/**
	 * used to set the Parameterof the element passed
	 * 
	 * @param element
	 * @param PropertySetter
	 * 
	 * 
	 */

	protected void setParameter(Element elem, PropertySetter propSetter)
	{
		String name = subst(elem.getAttribute(NAME_ATTR));
		String value = (elem.getAttribute(VALUE_ATTR));
		value = subst(OptionConverter.convertSpecialChars(value));
		propSetter.setProperty(name, value);
	}

	/**
	 * Configure log4j using a <code>configuration</code> element as defined in the log4j.dtd.
	 * 
	 * @param element
	 * 
	 */
	static public void configure(Element element)
	{
		CanvasLog4JXMLConfigurator configurator = new CanvasLog4JXMLConfigurator();
		configurator.doConfigure(element, LogManager.getLoggerRepository());
	}

	/**
	 * Like {@link #configureAndWatch(String, long)} except that the default delay as defined by
	 * {@link FileWatchdog#DEFAULT_DELAY} is used.
	 * 
	 * @param configFilename A log4j configuration file in XML format.
	 */
	static public void configureAndWatch(String configFilename)
	{
		configureAndWatch(configFilename, FileWatchdog.DEFAULT_DELAY);
	}

	/**
	 * Read the configuration file <code>configFilename</code> if it exists. Moreover, a thread will be created that
	 * will periodically check if <code>configFilename</code> has been created or modified. The period is determined by
	 * the <code>delay</code> argument. If a change or file creation is detected, then <code>configFilename</code> is
	 * read to configure log4j.
	 * 
	 * @param configFilename A log4j configuration file in XML format.
	 * @param delay The delay in milliseconds to wait between each check.
	 */
	static public void configureAndWatch(String configFilename, long delay)
	{
		configureAndWatch(configFilename, null, delay);
	}

	/**
	 * Read the configuration file <code>configFilename</code> if it exists.
	 * 
	 * @param configFilename A log4j configuration file in XML format.
	 * @param Properties.
	 */

	static public void configureAndWatch(String configFileName, Properties aProps)
	{
		configureAndWatch(configFileName, aProps, FileWatchdog.DEFAULT_DELAY);
	}

	/**
	 * Read the configuration file <code>configFilename</code> if it exists.
	 * 
	 * @param configFilename A log4j configuration file in XML format.
	 * @param delay The delay in milliseconds to wait between each check.
	 * @param Properties.
	 */

	static public void configureAndWatch(String configFileName, Properties aProps, long delay)
	{
		XMLWatchdog xdog = new XMLWatchdog(configFileName, aProps);
		xdog.setDelay(delay);
		xdog.start();
	}

	/**
	 * Configure log4j by reading in a log4j.dtd compliant XML configuration file.
	 * 
	 * @param InputStream
	 * @param LoggerRepository
	 * @throws FactoryConfigurationError
	 */
	public void doConfigure(final InputStream inputStream, LoggerRepository aRepository)
			throws FactoryConfigurationError
	{
		ParseAction action = new ParseAction()
		{
			public Document parse(final DocumentBuilder parser) throws SAXException, IOException
			{
				InputSource inputSource = new InputSource(inputStream);
				inputSource.setSystemId("dummy://log4j.dtd");
				return parser.parse(inputSource);
			}

			public String toString()
			{
				return "input stream [" + inputStream.toString() + "]";
			}
		};
		doConfigure(action, aRepository);
	}

	/**
	 * Configure log4j by reading in a log4j.dtd compliant XML configuration file.
	 * 
	 * @param Reader
	 * @param LoggerRepository
	 * @throws FactoryConfigurationError
	 */
	public void doConfigure(final Reader reader, LoggerRepository aRepository) throws FactoryConfigurationError
	{
		ParseAction action = new ParseAction()
		{
			public Document parse(final DocumentBuilder parser) throws SAXException, IOException
			{
				InputSource inputSource = new InputSource(reader);
				inputSource.setSystemId("dummy://log4j.dtd");
				return parser.parse(inputSource);
			}

			public String toString()
			{
				return "reader [" + reader.toString() + "]";
			}
		};
		doConfigure(action, aRepository);
	}

	/**
	 * Configure log4j by reading in a log4j.dtd compliant XML configuration file.
	 * 
	 * @param inputSource
	 * @param aRepository
	 * @throws FactoryConfigurationError
	 */
	protected void doConfigure(final InputSource inputSource, LoggerRepository aRepository)
			throws FactoryConfigurationError
	{
		if (inputSource.getSystemId() == null)
		{
			inputSource.setSystemId("dummy://log4j.dtd");
		}
		ParseAction action = new ParseAction()
		{
			public Document parse(final DocumentBuilder parser) throws SAXException, IOException
			{
				return parser.parse(inputSource);
			}

			public String toString()
			{
				return "input source [" + inputSource.toString() + "]";
			}
		};
		doConfigure(action, aRepository);
	}

	/**
	 * Configure log4j by reading in a log4j.dtd compliant XML configuration file.
	 * 
	 * @param action
	 * @param aRepository
	 * @throws FactoryConfigurationError
	 * @exception InterruptedException
	 * @exception InterruptedIOException
	 * 
	 */

	private final void doConfigure(final ParseAction action, final LoggerRepository aRepository)
			throws FactoryConfigurationError
	{
		DocumentBuilderFactory dbf = null;
		this.repository = aRepository;
		try
		{
			LogLog.debug("System property is :" + OptionConverter.getSystemProperty(dbfKey, null));
			dbf = DocumentBuilderFactory.newInstance();
			LogLog.debug("Standard DocumentBuilderFactory search succeded.");
			LogLog.debug("DocumentBuilderFactory is: " + dbf.getClass().getName());
		} catch (FactoryConfigurationError fce)
		{
			Exception e = fce.getException();
			LogLog.debug("Could not instantiate a DocumentBuilderFactory.", e);
			throw fce;
		}

		try
		{
			dbf.setValidating(true);

			DocumentBuilder docBuilder = dbf.newDocumentBuilder();

			docBuilder.setErrorHandler(new SAXErrorHandler());
			docBuilder.setEntityResolver(new Log4jEntityResolver());

			Document doc = action.parse(docBuilder);
			parse(doc.getDocumentElement());
		} catch (Exception e)
		{
			if (e instanceof InterruptedException || e instanceof InterruptedIOException)
			{
				Thread.currentThread().interrupt();
			}
			// I know this is miserable...
			LogLog.error("Could not parse " + action.toString() + ".", e);
		}
	}

	/**
	 * Configure by taking in an DOM element.
	 * 
	 * @param element
	 * @param aRepository
	 */
	public void doConfigure(Element element, LoggerRepository aRepository)
	{
		this.repository = aRepository;
		parse(element);
	}

	/**
	 * A static version of {@link #doConfigure(String, LoggerRepository)}.
	 * 
	 * @param string filename
	 * @throws FactoryConfigurationError
	 */
	static public void configure(String filename) throws FactoryConfigurationError
	{
		new CanvasLog4JXMLConfigurator().doConfigure(filename, LogManager.getLoggerRepository());
	}

	/**
	 * A static version of {@link #doConfigure(URL, LoggerRepository)}.
	 * 
	 * @param url
	 * @throws FactoryConfigurationError
	 */
	static public void configure(URL url) throws FactoryConfigurationError
	{
		new CanvasLog4JXMLConfigurator().doConfigure(url, LogManager.getLoggerRepository());
	}

	/**
	 * A static version of {@link #doConfigure(String, LoggerRepository)}.
	 * 
	 * @param filename
	 * @param runtimeProps
	 * @throws FactoryConfigurationError
	 */
	static public void configure(String filename, Properties runtimeProps) throws FactoryConfigurationError
	{
		CanvasLog4JXMLConfigurator configurator = new CanvasLog4JXMLConfigurator();
		configurator.setRuntimeProps(runtimeProps);
		configurator.doConfigure(filename, LogManager.getLoggerRepository());
	}

	/**
	 * A static version of {@link #doConfigure(URL, LoggerRepository)}.
	 * 
	 * @param url
	 * @param runtimeProps
	 * @throws FactoryConfigurationError
	 */
	static public void configure(URL url, Properties runtimeProps) throws FactoryConfigurationError
	{
		CanvasLog4JXMLConfigurator configurator = new CanvasLog4JXMLConfigurator();
		configurator.setRuntimeProps(runtimeProps);
		configurator.doConfigure(url, LogManager.getLoggerRepository());
	}

	/**
	 * Used internally to configure the log4j framework by parsing a DOM tree of XML elements based on <a
	 * href="doc-files/log4j.dtd">log4j.dtd</a>.
	 * 
	 * @param element
	 */
	protected void parse(Element element)
	{

		String rootElementName = element.getTagName();

		if (!rootElementName.equals(CONFIGURATION_TAG))
		{
			if (rootElementName.equals(OLD_CONFIGURATION_TAG))
			{
				LogLog.warn("The <" + OLD_CONFIGURATION_TAG + "> element has been deprecated.");
				LogLog.warn("Use the <" + CONFIGURATION_TAG + "> element instead.");
			} else
			{
				LogLog.error("DOM element is - not a <" + CONFIGURATION_TAG + "> element.");
				return;
			}
		}

		String debugAttrib = subst(element.getAttribute(INTERNAL_DEBUG_ATTR));

		LogLog.debug("debug attribute= \"" + debugAttrib + "\".");
		// if the log4j.dtd is not specified in the XML file, then the
		// "debug" attribute is returned as the empty string.
		if (!debugAttrib.equals("") && !debugAttrib.equals("null"))
		{
			LogLog.setInternalDebugging(OptionConverter.toBoolean(debugAttrib, true));
		} else
		{
			LogLog.debug("Ignoring " + INTERNAL_DEBUG_ATTR + " attribute.");
		}

		//
		// reset repository before configuration if reset="true"
		// on configuration element.
		//
		String resetAttrib = subst(element.getAttribute(RESET_ATTR));
		LogLog.debug("reset attribute= \"" + resetAttrib + "\".");
		if (!("".equals(resetAttrib)))
		{
			if (OptionConverter.toBoolean(resetAttrib, false))
			{
				repository.resetConfiguration();
			}
		}

		String confDebug = subst(element.getAttribute(CONFIG_DEBUG_ATTR));
		if (!confDebug.equals("") && !confDebug.equals("null"))
		{
			LogLog.warn("The \"" + CONFIG_DEBUG_ATTR + "\" attribute is deprecated.");
			LogLog.warn("Use the \"" + INTERNAL_DEBUG_ATTR + "\" attribute instead.");
			LogLog.setInternalDebugging(OptionConverter.toBoolean(confDebug, true));
		}

		String thresholdStr = subst(element.getAttribute(THRESHOLD_ATTR));
		LogLog.debug("Threshold =\"" + thresholdStr + "\".");
		if (!"".equals(thresholdStr) && !"null".equals(thresholdStr))
		{
			repository.setThreshold(thresholdStr);
		}

		// Hashtable appenderBag = new Hashtable(11);

		/**
		 * Building Appender objects, placing them in a local namespace for future reference
		 */

		// First configure each category factory under the root element.
		// Category factories need to be configured before any of
		// categories they support.
		//
		String tagName = null;
		Element currentElement = null;
		Node currentNode = null;
		NodeList children = element.getChildNodes();
		final int length = children.getLength();

		for (int loop = 0; loop < length; loop++)
		{
			currentNode = children.item(loop);
			if (currentNode.getNodeType() == Node.ELEMENT_NODE)
			{
				currentElement = (Element) currentNode;
				tagName = currentElement.getTagName();

				if (tagName.equals(CATEGORY_FACTORY_TAG) || tagName.equals(LOGGER_FACTORY_TAG))
				{
					parseCategoryFactory(currentElement);
				}
			}
		}

		for (int loop = 0; loop < length; loop++)
		{
			currentNode = children.item(loop);
			if (currentNode.getNodeType() == Node.ELEMENT_NODE)
			{
				currentElement = (Element) currentNode;
				tagName = currentElement.getTagName();

				if (tagName.equals(CATEGORY) || tagName.equals(LOGGER))
				{
					parseCategory(currentElement);
				} else if (tagName.equals(ROOT_TAG))
				{
					parseRoot(currentElement);
				} else if (tagName.equals(RENDERER_TAG))
				{
					parseRenderer(currentElement);
				} else if (tagName.equals(THROWABLE_RENDERER_TAG))
				{
					/**
					 * Commenting this as this is enabled only as part of Log4j 1.2.17. if (repository instanceof
					 * ThrowableRendererSupport) { ThrowableRenderer tr = parseThrowableRenderer(currentElement); if (tr
					 * != null) { ((ThrowableRendererSupport) repository).setThrowableRenderer(tr); } }
					 */
				} else if (!(tagName.equals(APPENDER_TAG) || tagName.equals(CATEGORY_FACTORY_TAG) || tagName
						.equals(LOGGER_FACTORY_TAG)))
				{
					quietParseUnrecognizedElement(repository, currentElement, props);
				}
			}
		}
	}

	/**
	 * Substitutes property value for any references in expression.
	 * 
	 * @param String value
	 * @return String
	 */
	protected String subst(final String value)
	{
		return subst(value, props);
	}

	/**
	 * Substitutes property value for any references in expression.
	 * 
	 * @param value value from configuration file, may contain literal text, property references or both
	 * @param props properties.
	 * @return evaluated expression, may still contain expressions if unable to expand.
	 * @exception IllegalArgumentException
	 * 
	 */
	public static String subst(final String value, final Properties props)
	{
		try
		{
			return OptionConverter.substVars(value, props);
		} catch (IllegalArgumentException e)
		{
			LogLog.warn("Could not perform variable substitution.", e);
			return value;
		}
	}

	/**
	 * Sets a parameter based from configuration file content.
	 * 
	 * @param elem param element, may not be null.
	 * @param propSetter property setter, may not be null.
	 * @param props properties
	 * 
	 */
	public static void setParameter(final Element elem, final PropertySetter propSetter, final Properties props)
	{
		String name = subst(elem.getAttribute("name"), props);
		String value = (elem.getAttribute("value"));
		value = subst(OptionConverter.convertSpecialChars(value), props);
		propSetter.setProperty(name, value);
	}

	/**
	 * Creates an object and processes any nested param elements but does not call activateOptions. If the class also
	 * supports UnrecognizedElementParser, the parseUnrecognizedElement method will be call for any child elements other
	 * than param.
	 * 
	 * @param element element, may not be null.
	 * @param props properties
	 * @param expectedClass interface or class expected to be implemented by created class
	 * @return created class or null.
	 * @throws Exception thrown if the contain object should be abandoned.
	 * 
	 */
	public static Object parseElement(final Element element, final Properties props, final Class expectedClass)
			throws Exception
	{
		String clazz = subst(element.getAttribute("class"), props);
		Object instance = OptionConverter.instantiateByClassName(clazz, expectedClass, null);

		if (instance != null)
		{
			PropertySetter propSetter = new PropertySetter(instance);
			NodeList children = element.getChildNodes();
			final int length = children.getLength();

			for (int loop = 0; loop < length; loop++)
			{
				Node currentNode = children.item(loop);
				if (currentNode.getNodeType() == Node.ELEMENT_NODE)
				{
					Element currentElement = (Element) currentNode;
					String tagName = currentElement.getTagName();
					if (tagName.equals("param"))
					{
						setParameter(currentElement, propSetter, props);
					} else
					{
						parseUnrecognizedElement(instance, currentElement, props);
					}
				}
			}
			return instance;
		}
		return null;
	}

}

class XMLWatchdog extends FileWatchdog
{
	Properties configProps;

	/**
	 * Constructor taking filename as input
	 * 
	 * @param filename
	 */

	XMLWatchdog(String filename)
	{
		super(filename);
	}

	/**
	 * Constructor taking filename,aProps as input
	 * 
	 * @param filename
	 * @param aProps
	 */

	XMLWatchdog(String fileName, Properties aProps)
	{
		super(fileName);
		configProps = aProps;
	}

	/**
	 * Call {@link DOMConfigurator#configure(String)} with the <code>filename</code> to reconfigure log4j.
	 */
	public void doOnChange()
	{
		CanvasLog4JXMLConfigurator configurator = new CanvasLog4JXMLConfigurator();
		configurator.props = configProps;
		configurator.doConfigure(filename, LogManager.getLoggerRepository());
	}
}
