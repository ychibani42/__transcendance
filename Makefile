# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: ychibani <ychibani@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2023/04/26 16:41:45 by estoffel          #+#    #+#              #
#    Updated: 2023/05/08 13:41:87by ychibani         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

COMPOSE	= docker compose -f ./docker-compose.yml

DOCKER = docker compose

_END=$'\e[0m
_BOLD=$'\e[1m
_UNDER=$'\e[4m
_REV=$'\e[7m
_GREY=$'\e[30m
_RED=$'\e[0;31m
_GREEN=$'\e[32m
_YELLOW=$'\e[33m
_BLUE=$'\e[34m
_PURPLE=$'\e[35m
_CYAN=$'\e[36m
_WHITE=$'\e[37m

_IGREY=$'\e[40m
_IRED=$'\e[41m
_IGREEN=$'\e[42m
_IYELLOW=$'\e[43m
_IBLUE=$'\e[44m
_IPURPLE=$'\e[45m
_ICYAN=$'\e[46m
_IWHITE=$'\e[47m


all:
	make build
	make up

help:
		@echo "------------------------------------------------------------------------------------------------"
		@echo "-${_CYAN} make		  	   ${_END}-> build the images, create and start containers"
		@echo "-${_CYAN} make build 	   	   ${_END}-> build the images"
		@echo "-${_CYAN} make up	 	   ${_END}-> create + start containers"
		@echo "-${_CYAN} make info		   ${_END}-> get status of dockers process"
		@echo "-${_CYAN} make ps	 	   ${_END}-> display containers info with ports, names and id"
		@echo "-${_CYAN} make stop	           ${_END}-> stop containers"
		@echo "-${_CYAN} make down	   	   ${_END}-> stop and remove containers"
		@echo "-${_CYAN} make fclean		   ${_END}-> down containers and remove images, volume, networks and clean every containers previously"
		@echo "-${_CYAN} make re	  	   ${_END}-> make fclean + make all\n"
		@echo "-----------------------------------------------------------------------------------------------"

#build the image from Dockerfile
build:
	$(COMPOSE) build

#give containers info
info:
	docker info | head -n 20

#builds images even when asked to up the containers
up:
	$(COMPOSE) up

#stop the containers
down:
	$(COMPOSE) down || true

#stop the containers
stop:
	$(COMPOSE) stop || true

ps:
	docker ps -a

postgres:
	docker exec -it postgres bash

nestjs:
	docker exec -it nestjs sh

vue:
	docker exec -it vue bash

logs:
	$(COMPOSE) logs

#clean everything
fclean: 
	$(COMPOSE) down || true
	docker rmi -f $(docker images -aq) 2>dev/null || true
	docker network rm $$(docker network ls -q) 2>/dev/null || true
	docker volume rm -f $$(docker volume ls -q) || true
	docker volume prune -af || true
	docker system prune -af || true

re: fclean all

.PHONY: build up logs down stop re
