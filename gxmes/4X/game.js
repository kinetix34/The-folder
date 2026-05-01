// Colony resource state
const resources = {
    meat: 50,
    water: 50,
    leaves: 20,
    nectar: 10,
    eggs: 5,
    pheromones: 0,
    ants: 5,
    soldiers: 0,
    chambers: 1
};

const machines = {
    meat: { level: 0, rate: 0, efficiency: 1, bonus: 0, special: 'None' },
    water: { level: 0, rate: 0, efficiency: 1, bonus: 0, special: 'None' },
    leaves: { level: 0, rate: 0, efficiency: 1, bonus: 0, special: 'None' },
    nectar: { level: 0, rate: 0, efficiency: 1, bonus: 0, special: 'None' }
};

const machineCatalog = {
    meat: {
        name: 'Meat Processor',
        resource: 'meat',
        buildCost: { leaves: 20, water: 12 },
        baseRate: 0.6,
        upgradeBase: { meat: 25, nectar: 10 },
        description: 'Converts raw resources into steady meat supplies.'
    },
    water: {
        name: 'Water Condenser',
        resource: 'water',
        buildCost: { leaves: 18, nectar: 6 },
        baseRate: 0.5,
        upgradeBase: { water: 20, meat: 10 },
        description: 'Condenses humidity into fresh water automatically.'
    },
    leaves: {
        name: 'Leaf Recycler',
        resource: 'leaves',
        buildCost: { water: 15, eggs: 4 },
        baseRate: 0.4,
        upgradeBase: { leaves: 18, water: 10 },
        description: 'Breaks down organic matter into usable leaf material.'
    },
    nectar: {
        name: 'Nectar Distiller',
        resource: 'nectar',
        buildCost: { leaves: 20, water: 14 },
        baseRate: 0.35,
        upgradeBase: { nectar: 18, eggs: 5 },
        description: 'Distills sweet nectar from collected foraging materials.'
    }
};

const machineMods = [
    { label: 'Overclocked', bonus: 0.30, efficiency: 1, description: '+30% output.' },
    { label: 'Resilient', bonus: 0, efficiency: 1.20, description: '-20% upkeep.' },
    { label: 'Precision', bonus: 0.18, efficiency: 1.10, description: '+18% output and +10% efficiency.' }
];

function formatCost(cost) {
    return Object.entries(cost)
        .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)} ${value}`)
        .join(', ');
}

function getMachineSummary() {
    const built = Object.values(machines).filter(machine => machine.level > 0).length;
    const active = built;
    const output = Object.keys(machines)
        .map(type => getMachineRate(type))
        .reduce((sum, amount) => sum + amount, 0);
    return { built, active, output };
}

function updateUI() {
    document.getElementById('meat').innerText = Math.floor(resources.meat);
    document.getElementById('water').innerText = Math.floor(resources.water);
    document.getElementById('leaves').innerText = Math.floor(resources.leaves);
    document.getElementById('nectar').innerText = Math.floor(resources.nectar);
    document.getElementById('eggs').innerText = resources.eggs;
    document.getElementById('pheromones').innerText = resources.pheromones;
    document.getElementById('ants').innerText = resources.ants;
    document.getElementById('soldiers').innerText = resources.soldiers;
    document.getElementById('chambers').innerText = resources.chambers;

    const summary = getMachineSummary();
    document.getElementById('machines-built').innerText = summary.built;
    document.getElementById('machines-active').innerText = summary.active;
    document.getElementById('total-machine-output').innerText = summary.output.toFixed(2);
    document.getElementById('hunger-pressure').innerText = resources.ants + resources.soldiers > 20 ? 'High' : 'Low';

    Object.keys(machines).forEach(type => {
        const machine = machines[type];
        document.getElementById(`${type}-machine-level`).innerText = machine.level;
        document.getElementById(`${type}-machine-rate`).innerText = getMachineRate(type).toFixed(2);
        document.getElementById(`${type}-machine-special`).innerText = machine.special;
        document.getElementById(`${type}-machine-status`).innerText = machine.level > 0 ? 'Active' : 'Locked';
        document.getElementById(`${type}-machine-upgrade`).innerText = machine.level > 0 ? formatCost(getUpgradeCost(type)) : 'N/A';
    });
}

function logMessage(message) {
    const log = document.getElementById('log');
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerText = message;
    log.prepend(entry);
    setTimeout(() => {
        if (entry.parentNode) {
            entry.parentNode.removeChild(entry);
        }
    }, 7000);
}

function hasResources(cost) {
    return Object.keys(cost).every(key => resources[key] >= cost[key]);
}

function spendResources(cost) {
    Object.keys(cost).forEach(key => {
        resources[key] -= cost[key];
    });
}

function buildMachine(type) {
    const machine = machines[type];
    const catalog = machineCatalog[type];

    if (machine.level > 0) {
        alert(`${catalog.name} is already built.`);
        return;
    }

    if (!hasResources(catalog.buildCost)) {
        alert('Not enough resources to build this machine.');
        return;
    }

    spendResources(catalog.buildCost);
    machine.level = 1;
    machine.rate = catalog.baseRate;
    machine.efficiency = 1;
    machine.bonus = 0;
    machine.special = 'None';
    updateUI();
    logMessage(`${catalog.name} built and begins producing ${catalog.resource}.`);
}

function getUpgradeCost(type) {
    const machine = machines[type];
    const catalog = machineCatalog[type];
    const level = Math.max(1, machine.level);
    const multiplier = 1 + (level - 1) * 0.25;
    const cost = {};

    Object.keys(catalog.upgradeBase).forEach(key => {
        cost[key] = Math.ceil(catalog.upgradeBase[key] * multiplier);
    });

    return cost;
}

function upgradeMachine(type) {
    const machine = machines[type];
    const catalog = machineCatalog[type];

    if (machine.level === 0) {
        alert('Build the machine before upgrading it.');
        return;
    }

    const cost = getUpgradeCost(type);
    if (!hasResources(cost)) {
        alert('Not enough resources to upgrade this machine.');
        return;
    }

    spendResources(cost);
    machine.level += 1;
    machine.rate += catalog.baseRate * 0.25;

    if (Math.random() < 0.20) {
        const newMod = machineMods[Math.floor(Math.random() * machineMods.length)];
        machine.special = newMod.label;
        machine.bonus = newMod.bonus;
        machine.efficiency = newMod.efficiency;
        logMessage(`${catalog.name} receives a special modification: ${newMod.label}. ${newMod.description}`);
    } else {
        logMessage(`${catalog.name} upgraded to level ${machine.level}.`);
    }

    updateUI();
}

function getMachineRate(type) {
    const machine = machines[type];
    if (machine.level === 0) return 0;
    return (machine.rate + machine.bonus) * machine.efficiency * machine.level;
}

function harvest(type) {
    const gather = {
        meat: 5,
        water: 5,
        leaves: 4,
        nectar: 3
    };

    resources[type] += gather[type] || 1;
    updateUI();
    logMessage(`Collected ${gather[type] || 1} ${type}.`);
}

function createBrood() {
    if (resources.leaves >= 15 && resources.water >= 10) {
        resources.leaves -= 15;
        resources.water -= 10;
        resources.eggs += 1;
        updateUI();
        logMessage('A new brood egg is laid.');
    } else {
        alert('Need at least 15 leaves and 10 water to create brood.');
    }
}

function hatchWorker() {
    if (resources.eggs >= 1 && resources.meat >= 10) {
        resources.eggs -= 1;
        resources.meat -= 10;
        resources.ants += 1;
        updateUI();
        logMessage('A new worker ant hatches.');
    } else {
        alert('Need 1 egg and 10 meat to hatch a worker.');
    }
}

function trainSoldier() {
    if (resources.meat >= 30 && resources.nectar >= 10) {
        resources.meat -= 30;
        resources.nectar -= 10;
        resources.soldiers += 1;
        updateUI();
        logMessage('A soldier ant is trained.');
    } else {
        alert('Need 30 meat and 10 nectar to train a soldier.');
    }
}

function buildChamber() {
    if (resources.leaves >= 25 && resources.water >= 20) {
        resources.leaves -= 25;
        resources.water -= 20;
        resources.chambers += 1;
        updateUI();
        logMessage('A new nest chamber is built.');
    } else {
        alert('Need 25 leaves and 20 water to build a chamber.');
    }
}

function researchPheromones() {
    if (resources.nectar >= 20 && resources.eggs >= 2) {
        resources.nectar -= 20;
        resources.eggs -= 2;
        resources.pheromones += 1;
        updateUI();
        logMessage('Pheromone research improves colony coordination.');
    } else {
        alert('Need 20 nectar and 2 eggs to research pheromones.');
    }
}

function applyPassiveEffects() {
    if (resources.ants <= 0 && resources.soldiers <= 0) return;

    Object.keys(machines).forEach(type => {
        const machine = machines[type];
        if (machine.level > 0) {
            const amount = getMachineRate(type);
            resources[type] += amount;
            if (amount > 0) {
                logMessage(`${machineCatalog[type].name} produced ${amount.toFixed(1)} ${type}.`);
            }
        }
    });

    const antMeat = resources.ants * 0.08;
    const antWater = resources.ants * 0.08;
    const soldierMeat = resources.soldiers * 0.15;
    const soldierWater = resources.soldiers * 0.12;

    resources.meat -= antMeat + soldierMeat;
    resources.water -= antWater + soldierWater;

    if (resources.pheromones > 0) {
        resources.leaves += resources.pheromones * 0.2;
        resources.nectar += resources.pheromones * 0.15;
    }

    if (resources.meat < 0 || resources.water < 0) {
        if (resources.soldiers > 0) {
            resources.soldiers = Math.max(0, resources.soldiers - 1);
            logMessage('A soldier has fallen from starvation.');
        } else if (resources.ants > 0) {
            resources.ants = Math.max(0, resources.ants - 1);
            logMessage('A worker has starved.');
        }
        resources.meat = Math.max(0, resources.meat);
        resources.water = Math.max(0, resources.water);
    }

    updateUI();
}

setInterval(applyPassiveEffects, 1000);
updateUI();
