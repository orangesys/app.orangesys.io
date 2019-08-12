#-------------------------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See https://go.microsoft.com/fwlink/?linkid=2090316 for license information.
#-------------------------------------------------------------------------------------------------------------

FROM node:10

# Avoid warnings by switching to noninteractive
ENV DEBIAN_FRONTEND=noninteractive

# Configure apt and install packages
RUN apt-get update \
	&& apt-get -y install --no-install-recommends apt-utils 2>&1 \
	#
	# Verify git and needed tools are installed
	&& apt-get install -y git procps

# Install ESLint and TypeScript globally
RUN npm install -g eslint typescript

# Install Aurelia and Fireabse CLI tools globally
RUN npm install -g aurelia-cli firebase-tools

# Clean up
RUN apt-get autoremove -y \
	&& apt-get clean -y \
	&& rm -rf /var/lib/apt/lists/*

# Switch back to dialog for any ad-hoc use of apt-get
ENV DEBIAN_FRONTEND=dialog
