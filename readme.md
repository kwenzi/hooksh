# Webhook server to trigger custom shell scripts.

Deploy is a tool which will locally execute a given command when a request (authenticated) is received.

Simply put, it exposes an api that will trigger local script execution.

You can control the mapping between entry-points and shell scripts in a yaml file.

The response of any given api call is a new execution resource where the output and exit status of the command can be explored.

## Use case

The simplest deploy process is to pull the updates of a git repository, we need to trigger the pull only when a push has been made to the master branch.
