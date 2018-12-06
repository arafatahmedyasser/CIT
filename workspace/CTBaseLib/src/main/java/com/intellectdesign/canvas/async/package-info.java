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
/**
 * This package contains the set of classes that provide the option within the framework
 * to move a task into an asynchronous processing route. The key classes within this package are
 * <ul>
 * <li><b>AsyncJob</b>: This is the job that needs to be processed in an asynchronous manner. This class by itself has to be serializable as well as have the execute method that executes this job</li>
 * <li><b>AsyncContext</b>: This is the context that will be be provided to the Job that can be used by the job to access any context information shared when the job was triggered</li>
 * <li><b>AsyncDispatcher</b>: This is the entry point for the developer to make a job go async</li>
 * </ul>
 * 
 * Asynchronous processing itself can happen in 2 ways and this is an aspect that will have to be provided to the framework as part of its configuration - 
 * a) Using JMS / MDB as the basis to move the job to an asynchronous processing, or
 * b) Using ThreadPoolExecutor provided by the java.util.concurrent package
 * 
 * While both have their own advantages, the key aspect to consider which mode to work with is whether the running environment has an application container present or not. In cases where the end 
 * application is expected to run within a web container, then the choice would be ThreadPoolExecutor.
 * 
 * Also the package supports for custom Asynchronous execution setup to be configured. If none is configured, the default is always taken as ThreadPoolExecutor with a default configuration. An Asynchronous execution setup comprises of the below - 
 * a) The Asynchronous processing mode to use (JMS / TPE)
 * b) Additional configuration specific to the choice made in (a). For example, for JMS, it could be the Queue name, and other information
 * c) And a unique name with which this configuration is to be identified.
 * 
 * By default an Asynchronous execution setup with a name "DEFAULT" would be created with the configuration as - 
 * Processing Mode = "TPE", Max Threads in Pool = 5, Initial Threads in Pool = 2
 * 
 * @Version 15.1
 */
package com.intellectdesign.canvas.async;