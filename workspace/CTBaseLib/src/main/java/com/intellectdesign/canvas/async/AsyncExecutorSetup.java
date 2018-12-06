/**
 * Copyright 2015. Intellect Design Arena Limited. All rights reserved. 
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
package com.intellectdesign.canvas.async;

/**
 * This class models the executor setup provided. An Asynchronous execute setup captures the following information
 * related to the setup -
 * <ul>
 * <li><b>Name</b>: This is the name with which this setup is to be identified</li>
 * <li><b>Attributes</b>: These are multiple options that can be shared to an executor setup for its initialization /
 * configuraton</li>
 * </ul>
 * 
 * @Version 15.1
 */
public abstract class AsyncExecutorSetup
{
	public static final String IMPLEMENTATION_CLASS = "implementationClass";
	private String name;

	/**
	 * The only constructor
	 */
	public AsyncExecutorSetup(String setupName)
	{
		setName(setupName);
	}

	/**
	 * Gets the name of this setup. This uniquely identifies this setup
	 * 
	 * @return The name of this setup
	 */
	public String getName()
	{
		return name;
	}

	/**
	 * This method has to be implemented by the sub classes for accepting any dynamic attributes provided to the
	 * executor configuration
	 * 
	 * @param attribName The name of the attribute
	 * @param attribValue The value of the attribute
	 * @throws AsyncExecutorException Exception thrown if the attribute provide is not a valid option for this executor
	 *             setup
	 */
	public abstract void setAttribute(String attribName, String attribValue) throws AsyncExecutorException;

	/**
	 * This method will be triggered to initialize this setup post providing all attributes to the setup.
	 * 
	 * @throws AsyncExecutorException Exception to be thrown if there are any errors while initialing based on the
	 *             configuration provided
	 */
	public abstract void initialize() throws AsyncExecutorException;

	/**
	 * This method will be invoked by the caller for adding a job. Here the job is to be queued up for execution
	 * 
	 * @param aJob The job to be queued
	 * @throws AsyncExecutorException Thrown of any error occurs while added to the job queue
	 * @throws IllegalArgumentException Thrown if the Job provided is null.
	 */
	public abstract void addJob(AsyncJob aJob) throws AsyncExecutorException;

	/**
	 * This method will be invoked to shutdown this executor. No exceptions can be thrown here as irrespective of the
	 * exception faced, the system will look to move ahead.
	 */
	public abstract void shutdown();

	/**
	 * Sets the name of the setup
	 * 
	 * @param setupName The name of this setup
	 */
	private void setName(String setupName)
	{
		name = setupName;
	}

}
