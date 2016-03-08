﻿module app.arithmetic {
    "use strict";

    interface IArithmeticScope extends ng.IScope {
        configuration: app.models.ExerciseConfiguration;
        exerciseDriver: app.models.IExerciseDriver;
        startExercise(): void;
        stopExercise(): void;
        respondToCurrentChallenge(answer: number): void;
        skipCurrentChallenge(): void;
    }

    class ArithmeticCtrl {
        public static $inject = ["$scope"];
        public constructor(private $scope: IArithmeticScope) {
            this.$scope.configuration = this.getDefaultConfiguration();
            this.$scope.respondToCurrentChallenge = (answer) => this.$scope.exerciseDriver.respondToCurrentChallenge(answer);
            this.$scope.skipCurrentChallenge = () => this.$scope.exerciseDriver.skipCurrentChallenge();
            this.$scope.startExercise = () => this.startExercise();
            this.$scope.stopExercise = () => this.stopExercise();
            this.$scope.exerciseDriver = null;
        }

        public startExercise(): void {
            var configuration = this.clone(this.$scope.configuration);
            this.$scope.exerciseDriver = new app.models.ExerciseDriver(configuration);
            this.$scope.exerciseDriver.start();
        }

        public stopExercise(): void {
            this.$scope.exerciseDriver = null;
        }

        private getDefaultConfiguration(): app.models.ExerciseConfiguration {
            var configuration = new app.models.ExerciseConfiguration();

            configuration.exerciseCompleteDriver.type = app.models.ExerciseCompleteDriverType.ChallengesCompleted;
            configuration.exerciseCompleteDriver.completeAfterChallengesCompleted = 10;
            configuration.exerciseCompleteDriver.completeAfterChallengesSolved = 10;
            configuration.exerciseCompleteDriver.completeAfterSeconds = 10;

            configuration.challengeFactory.type = app.models.ChallengeFactoryType.SplitNumbers;
            configuration.challengeFactory.minNumber = 0;
            configuration.challengeFactory.maxNumber = 10;
            configuration.challengeFactory.primaryComponentSequence = app.models.SequenceType.Random;
            configuration.challengeFactory.secondaryComponentSequence = app.models.SequenceType.Up;

            configuration.challengeCompleteDriver.type = app.models.ChallengeCompleteDriverType.Responded;

            return configuration;
        }

        private clone<T>(value: T): T {
            return JSON.parse(JSON.stringify(value));
        }
    }

    angular.module(app.models.Constants.App.AngularAppName).controller(app.models.Constants.ControllerNames.Arithmetic, ArithmeticCtrl);
}