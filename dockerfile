# Use a Node.js base image
FROM node:20

# Set the working directory in the container
WORKDIR /root/deploy/datn/ServiceEcommerce

# Copy package.json and package-lock.json
COPY . .

# Install dependencies
RUN yarn install

# Gen proto
RUN yarn gen:proto_folder
RUN yarn gen:proto

# Migrate db
RUN migrate_name="merge_db_from_new_pull" yarn migrate 
RUN yarn generate

# Creates a "dist" folder with the production build
RUN yarn build

# Expose the port your app runs on
EXPOSE 3002

# Command to run your application
CMD ["yarn", "start"]