"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var typeorm_1 = require("typeorm");
var workout_entity_1 = require("../../workouts/entities/workout.entity");
var goal_entity_1 = require("../../goals/entities/goal.entity");
var exercise_entity_1 = require("../../exercises/entities/exercise.entity");
var User = function () {
    var _classDecorators = [(0, typeorm_1.Entity)("users")];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _role_decorators;
    var _role_initializers = [];
    var _role_extraInitializers = [];
    var _trainerId_decorators;
    var _trainerId_initializers = [];
    var _trainerId_extraInitializers = [];
    var _workouts_decorators;
    var _workouts_initializers = [];
    var _workouts_extraInitializers = [];
    var _goals_decorators;
    var _goals_initializers = [];
    var _goals_extraInitializers = [];
    var _customExercises_decorators;
    var _customExercises_initializers = [];
    var _customExercises_extraInitializers = [];
    var User = _classThis = /** @class */ (function () {
        function User_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.email = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _email_initializers, void 0));
            this.name = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.role = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _role_initializers, void 0));
            this.trainerId = (__runInitializers(this, _role_extraInitializers), __runInitializers(this, _trainerId_initializers, void 0));
            this.workouts = (__runInitializers(this, _trainerId_extraInitializers), __runInitializers(this, _workouts_initializers, void 0));
            this.goals = (__runInitializers(this, _workouts_extraInitializers), __runInitializers(this, _goals_initializers, void 0));
            this.customExercises = (__runInitializers(this, _goals_extraInitializers), __runInitializers(this, _customExercises_initializers, void 0));
            __runInitializers(this, _customExercises_extraInitializers);
        }
        return User_1;
    }());
    __setFunctionName(_classThis, "User");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _email_decorators = [(0, typeorm_1.Column)({ unique: true })];
        _name_decorators = [(0, typeorm_1.Column)()];
        _role_decorators = [(0, typeorm_1.Column)({ default: "athlete" })];
        _trainerId_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _workouts_decorators = [(0, typeorm_1.OneToMany)(function () { return workout_entity_1.Workout; }, function (workout) { return workout.athlete; })];
        _goals_decorators = [(0, typeorm_1.OneToMany)(function () { return goal_entity_1.Goal; }, function (goal) { return goal.athlete; })];
        _customExercises_decorators = [(0, typeorm_1.OneToMany)(function () { return exercise_entity_1.Exercise; }, function (exercise) { return exercise.trainer; })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: function (obj) { return "role" in obj; }, get: function (obj) { return obj.role; }, set: function (obj, value) { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
        __esDecorate(null, null, _trainerId_decorators, { kind: "field", name: "trainerId", static: false, private: false, access: { has: function (obj) { return "trainerId" in obj; }, get: function (obj) { return obj.trainerId; }, set: function (obj, value) { obj.trainerId = value; } }, metadata: _metadata }, _trainerId_initializers, _trainerId_extraInitializers);
        __esDecorate(null, null, _workouts_decorators, { kind: "field", name: "workouts", static: false, private: false, access: { has: function (obj) { return "workouts" in obj; }, get: function (obj) { return obj.workouts; }, set: function (obj, value) { obj.workouts = value; } }, metadata: _metadata }, _workouts_initializers, _workouts_extraInitializers);
        __esDecorate(null, null, _goals_decorators, { kind: "field", name: "goals", static: false, private: false, access: { has: function (obj) { return "goals" in obj; }, get: function (obj) { return obj.goals; }, set: function (obj, value) { obj.goals = value; } }, metadata: _metadata }, _goals_initializers, _goals_extraInitializers);
        __esDecorate(null, null, _customExercises_decorators, { kind: "field", name: "customExercises", static: false, private: false, access: { has: function (obj) { return "customExercises" in obj; }, get: function (obj) { return obj.customExercises; }, set: function (obj, value) { obj.customExercises = value; } }, metadata: _metadata }, _customExercises_initializers, _customExercises_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        User = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return User = _classThis;
}();
exports.User = User;
